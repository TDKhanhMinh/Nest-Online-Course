import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IOrderRepository,
  IORDER_REPOSITORY,
} from '@domain/order/ports/i-order.repository';
import {
  ITransactionRepository,
  ITRANSACTION_REPOSITORY,
} from '@domain/order/ports/i-transaction.repository';
import {
  IUSER_REPOSITORY,
  IUserRepository,
} from '@domain/user/ports/i-user.repository';
import {
  IVNPAY_GATEWAY_SERVICE,
  IVnPayGatewayService,
} from '@domain/order/ports/i-vnpay-gateway.service';
import { UniqueId } from '@shared/types/unique-id.vo';
import { OrderStatus } from '@shared/types/order-status.enum';
import { TransactionStatus } from '@shared/types/transaction-status.enum';
import { OrderSuccessEvent } from '../events/order-success.event';

@Injectable()
export class ProcessVnPayIpnUseCase {
  private readonly logger = new Logger(ProcessVnPayIpnUseCase.name);

  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    @Inject(ITRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(IUSER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(IVNPAY_GATEWAY_SERVICE)
    private readonly vnpayGateway: IVnPayGatewayService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(params: Record<string, string>): Promise<{ RspCode: string; Message: string }> {
    this.logger.log(`Received VNPay IPN params: ${JSON.stringify(params)}`);

    try {
      // 1. Verify signature
      const verification = this.vnpayGateway.verifyParams(params);
      if (!verification.isValidSignature) {
        this.logger.warn('VNPay IPN Verification Failed: Invalid Signature');
        return { RspCode: '97', Message: 'Invalid Signature' };
      }

      const txnRef = verification.txnRef;
      if (!txnRef) {
        return { RspCode: '01', Message: 'Order not found' };
      }

      // 2. Find Transaction
      const transaction = await this.transactionRepo.findByTxnRef(txnRef);
      if (!transaction) {
        this.logger.warn(`VNPay IPN: Transaction ${txnRef} not found`);
        return { RspCode: '01', Message: 'Order not found' };
      }

      // 3. Verify Amount
      // VNPay amount is sent as vnp_Amount, verification.amount parses it (divided by 100)
      if (verification.amount !== transaction.amountVnd) {
        this.logger.warn(
          `VNPay IPN: Invalid amount. Expected ${transaction.amountVnd}, received ${verification.amount}`,
        );
        return { RspCode: '04', Message: 'Invalid Amount' };
      }

      // 4. Verify transaction state
      if (transaction.status !== TransactionStatus.PENDING) {
        this.logger.log(`VNPay IPN: Transaction ${txnRef} is already confirmed as ${transaction.status}`);
        return { RspCode: '02', Message: 'Order already confirmed' };
      }

      // 5. Update status
      const responseCode = verification.responseCode;
      const order = await this.orderRepo.findById(transaction.orderId);

      if (responseCode === '00') {
        // Success
        transaction.markAsSuccess(verification.gatewayTransactionNo || 'VNPAY_' + txnRef, params);
        await this.transactionRepo.save(transaction);

        if (order && order.status !== OrderStatus.SUCCESS) {
          order.markAsPaid();
          const items = await this.orderRepo.findItemsByOrderId(order.id);
          await this.orderRepo.save(order, []);

          const user = await this.userRepo.findById(order.studentId);
          const studentEmail = user ? user.email : '';

          // Emit event for automatic enrollment
          this.eventEmitter.emit(
            'order.success',
            new OrderSuccessEvent(
              order.id.value,
              order.studentId.value,
              items.map((item) => item.courseId.value),
              studentEmail,
            ),
          );
        }

        this.logger.log(`VNPay IPN: Transaction ${txnRef} confirmed SUCCESS`);
      } else {
        // Failed payment at gateway
        transaction.markAsFailed(responseCode, `VNPay failed response code: ${responseCode}`, params);
        await this.transactionRepo.save(transaction);

        if (order && order.status !== OrderStatus.SUCCESS) {
          order.markAsFailed();
          await this.orderRepo.save(order, []);
        }

        this.logger.log(`VNPay IPN: Transaction ${txnRef} marked FAILED`);
      }

      return { RspCode: '00', Message: 'Confirm success' };
    } catch (error: any) {
      this.logger.error(`VNPay IPN Error: ${error.message}`, error.stack);
      return { RspCode: '99', Message: 'Input Required data Error' };
    }
  }
}
