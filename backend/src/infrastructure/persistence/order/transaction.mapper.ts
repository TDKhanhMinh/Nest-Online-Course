import { Injectable } from '@nestjs/common';
import { Transaction } from '@domain/order/entities/transaction.entity';
import { TransactionDocument } from '@/database/schemas/transaction.schema';
import { UniqueId } from '@shared/types/unique-id.vo';
import { TransactionStatus } from '@shared/types/transaction-status.enum';
import { PaymentMethod } from '@shared/types/payment-method.enum';

@Injectable()
export class TransactionMapper {
  public toDomain(doc: TransactionDocument): Transaction {
    return Transaction.reconstitute(
      {
        userId: new UniqueId(doc.userId.toString()),
        orderId: new UniqueId(doc.orderId.toString()),
        courseId: doc.courseId ? new UniqueId(doc.courseId.toString()) : undefined,
        paymentMethod: doc.paymentMethod as PaymentMethod,
        status: doc.status as TransactionStatus,
        amountVnd: doc.amountVnd,
        currency: doc.currency,
        amount: doc.amount,
        exchangeRate: doc.exchangeRate,
        gatewayOrderId: doc.gatewayOrderId,
        gatewayTransactionNo: doc.gatewayTransactionNo,
        gatewayResponseCode: doc.gatewayResponseCode,
        gatewayMessage: doc.gatewayMessage,
        paymentUrl: doc.paymentUrl,
        rawRequest: doc.rawRequest,
        rawResponse: doc.rawResponse,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        paidAt: doc.paidAt,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  public toPersistence(domain: Transaction): any {
    return {
      _id: domain.id.value,
      userId: domain.userId.value,
      orderId: domain.orderId.value,
      courseId: domain.courseId?.value,
      paymentMethod: domain.paymentMethod,
      status: domain.status,
      amountVnd: domain.amountVnd,
      currency: domain.currency,
      amount: domain.amount,
      exchangeRate: domain.exchangeRate,
      gatewayOrderId: domain.gatewayOrderId,
      gatewayTransactionNo: domain.gatewayTransactionNo,
      gatewayResponseCode: domain.gatewayResponseCode,
      gatewayMessage: domain.gatewayMessage,
      paymentUrl: domain.paymentUrl,
      rawRequest: domain.rawRequest,
      rawResponse: domain.rawResponse,
      paidAt: domain.paidAt,
    };
  }
}
