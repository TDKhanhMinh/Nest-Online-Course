import { Transaction } from '@domain/order/entities/transaction.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const ITRANSACTION_REPOSITORY = Symbol('ITransactionRepository');

export interface ITransactionRepository {
  findById(id: UniqueId): Promise<Transaction | null>;
  findByTransactionId(transactionId: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
}



