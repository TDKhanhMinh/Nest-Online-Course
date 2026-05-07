import { Transaction } from '@domain/order/entities/transaction.entity';
import { TransactionDocument } from '@/database/schemas/transaction.schema';
import { UniqueId } from '@shared/types/unique-id.vo';
import { TransactionStatus } from '@shared/types/transaction-status.enum';

export class TransactionMapper {
  static toDomain(doc: TransactionDocument): Transaction {
    return Transaction.reconstitute(
      {
        userId: new UniqueId(doc.userId.toString()),
        courseId: doc.courseId ? new UniqueId(doc.courseId.toString()) : undefined,
        amount: parseFloat(doc.amount.toString()),
        provider: doc.provider,
        transactionId: doc.transactionId,
        status: doc.status as TransactionStatus,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: Transaction): any {
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
