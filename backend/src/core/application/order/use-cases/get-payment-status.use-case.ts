import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  IOrderRepository,
  IORDER_REPOSITORY,
} from '@domain/order/ports/i-order.repository';
import {
  ITransactionRepository,
  ITRANSACTION_REPOSITORY,
} from '@domain/order/ports/i-transaction.repository';
import { UniqueId } from '@shared/types/unique-id.vo';
import { OrderStatus } from '@shared/types/order-status.enum';
import { PaymentMethod } from '@shared/types/payment-method.enum';
import { TransactionStatus } from '@shared/types/transaction-status.enum';

@Injectable()
export class GetPaymentStatusUseCase {
  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    @Inject(ITRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(
    studentId: string,
    orderId: string,
  ): Promise<{
    orderId: string;
    totalAmount: number;
    orderStatus: OrderStatus;
    paymentMethod?: PaymentMethod;
    paidAt?: Date;
    transaction?: {
      id: string;
      status: TransactionStatus;
      gatewayTransactionNo?: string;
      currency: string;
      amount: number;
    };
  }> {
    const order = await this.orderRepo.findById(new UniqueId(orderId));
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (order.studentId.value !== studentId) {
      throw new ForbiddenException('You do not own this order');
    }

    const transactions = await this.transactionRepo.findByOrderId(order.id);
    // Sort transactions by updatedAt descending to find the latest
    const sortedTxns = transactions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    const latestTxn = sortedTxns[0];

    return {
      orderId: order.id.value,
      totalAmount: order.totalAmount,
      orderStatus: order.status,
      paymentMethod: order.paymentMethod,
      paidAt: order.paidAt,
      transaction: latestTxn
        ? {
            id: latestTxn.id.value,
            status: latestTxn.status,
            gatewayTransactionNo: latestTxn.gatewayTransactionNo,
            currency: latestTxn.currency,
            amount: latestTxn.amount,
          }
        : undefined,
    };
  }
}
