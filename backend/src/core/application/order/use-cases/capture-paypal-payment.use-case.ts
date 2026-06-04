import { Inject, Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
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
  IPAYPAL_GATEWAY_SERVICE,
  IPayPalGatewayService,
} from '@domain/order/ports/i-paypal-gateway.service';
import { UniqueId } from '@shared/types/unique-id.vo';
import { OrderStatus } from '@shared/types/order-status.enum';
import { TransactionStatus } from '@shared/types/transaction-status.enum';
import { OrderSuccessEvent } from '../events/order-success.event';

export interface CapturePayPalPaymentDto {
  paypalOrderId: string;
}

@Injectable()
export class CapturePayPalPaymentUseCase {
  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    @Inject(ITRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(IUSER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(IPAYPAL_GATEWAY_SERVICE)
    private readonly paypalGateway: IPayPalGatewayService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    studentId: string,
    dto: CapturePayPalPaymentDto,
  ): Promise<{ status: string; orderId: string }> {
    const transaction = await this.transactionRepo.findByGatewayOrderId(dto.paypalOrderId);
    if (!transaction) {
      throw new NotFoundException(`Transaction with PayPal Order ID ${dto.paypalOrderId} not found`);
    }

    if (transaction.userId.value !== studentId) {
      throw new ForbiddenException('You do not own this transaction');
    }

    const order = await this.orderRepo.findById(transaction.orderId);
    if (!order) {
      throw new NotFoundException(`Order ${transaction.orderId.value} not found`);
    }

    // Idempotency: if already processed
    if (transaction.status === TransactionStatus.SUCCESS) {
      return { status: 'COMPLETED', orderId: order.id.value };
    }

    if (transaction.status === TransactionStatus.FAILED) {
      throw new BadRequestException('Transaction has already failed');
    }

    try {
      const { status, captureId, rawResponse } = await this.paypalGateway.captureOrder(dto.paypalOrderId);

      if (status === 'COMPLETED') {
        transaction.markAsSuccess(captureId || dto.paypalOrderId, rawResponse);
        await this.transactionRepo.save(transaction);

        if (order.status !== OrderStatus.SUCCESS) {
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
              studentId,
              items.map((item) => item.courseId.value),
              studentEmail,
            ),
          );
        }

        return { status: 'COMPLETED', orderId: order.id.value };
      } else {
        transaction.markAsFailed('PAYPAL_CAPTURE_NOT_COMPLETED', `PayPal status: ${status}`, rawResponse);
        await this.transactionRepo.save(transaction);

        return { status, orderId: order.id.value };
      }
    } catch (err: any) {
      transaction.markAsFailed('PAYPAL_CAPTURE_FAILED', err.message || 'PayPal capture failed');
      await this.transactionRepo.save(transaction);
      throw new BadRequestException(`PayPal capture failed: ${err.message}`);
    }
  }
}
