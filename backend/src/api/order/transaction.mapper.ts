import { Injectable } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { TransactionDocument } from '@/database/schemas/transaction.schema';

@Injectable()
export class TransactionMapper {
  public toDomain(doc: TransactionDocument): Transaction {
    return Transaction.reconstitute(
      {
        userId: doc.userId.toString(),
        courseId: doc.courseId?.toString(),
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
      userId: domain.userId,
      courseId: domain.courseId,
      amount: domain.amount,
      provider: domain.provider,
      transactionId: domain.transactionId,
      status: domain.status,
    };
  }
}
