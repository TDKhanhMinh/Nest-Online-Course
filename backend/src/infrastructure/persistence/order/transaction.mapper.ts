import { Injectable } from '@nestjs/common';
import { Transaction } from '@domain/order/entities/transaction.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { TransactionDocument } from '@/database/schemas/transaction.schema';

@Injectable()
export class TransactionMapper {
  public toDomain(doc: TransactionDocument): Transaction {
    return Transaction.reconstitute(
      {
        userId: new UniqueId(doc.userId.toString()),
        courseId: doc.courseId
          ? new UniqueId(doc.courseId.toString())
          : undefined,
        amount: parseFloat(doc.amount.toString()),
        provider: doc.provider,
        transactionId: doc.transactionId,
        status: doc.status,
      },
      (doc._id as any).toString(),
    );
  }

  public toPersistence(domain: Transaction): any {
    return {
      _id: domain.id.value,
      userId: domain.userId.value,
      courseId: domain.courseId?.value,
      amount: domain.amount,
      provider: domain.provider,
      transactionId: domain.transactionId,
      status: domain.status,
    };
  }
}
