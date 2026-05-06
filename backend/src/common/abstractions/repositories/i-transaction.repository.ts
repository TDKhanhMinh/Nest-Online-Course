import { Transaction } from '@/api/order/entities/transaction.entity';

export const ITRANSACTION_REPOSITORY = 'ITRANSACTION_REPOSITORY';

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByTransactionId(transactionId: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
}
