import { Transaction } from '@domain/order/entities/transaction.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const ITRANSACTION_REPOSITORY = Symbol('ITransactionRepository');

export interface ITransactionRepository {
  findById(id: UniqueId): Promise<Transaction | null>;
  findByOrderId(orderId: UniqueId): Promise<Transaction[]>;
  findPendingByOrderId(orderId: UniqueId): Promise<Transaction | null>;
  findByGatewayOrderId(gatewayOrderId: string): Promise<Transaction | null>;
  findByTxnRef(txnRef: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
}
