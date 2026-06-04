import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionDocument } from '@/database/schemas/transaction.schema';
import { Transaction } from '@domain/order/entities/transaction.entity';
import { ITransactionRepository } from '@domain/order/ports/i-transaction.repository';
import { TransactionMapper } from './transaction.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';
import { TransactionStatus } from '@shared/types/transaction-status.enum';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionDocument.name)
    private readonly model: Model<TransactionDocument>,
    private readonly mapper: TransactionMapper,
  ) {}

  async findById(id: UniqueId): Promise<Transaction | null> {
    const doc = await this.model.findById(id.value).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findByOrderId(orderId: UniqueId): Promise<Transaction[]> {
    const docs = await this.model.find({ orderId: orderId.value }).exec();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findPendingByOrderId(orderId: UniqueId): Promise<Transaction | null> {
    const doc = await this.model
      .findOne({ orderId: orderId.value, status: TransactionStatus.PENDING })
      .exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findByGatewayOrderId(gatewayOrderId: string): Promise<Transaction | null> {
    const doc = await this.model.findOne({ gatewayOrderId }).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findByTxnRef(txnRef: string): Promise<Transaction | null> {
    const doc = await this.model.findById(txnRef).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async save(transaction: Transaction): Promise<void> {
    const persistence = this.mapper.toPersistence(transaction);
    await this.model
      .findByIdAndUpdate(persistence._id, persistence, { upsert: true })
      .exec();
  }
}
