import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionDocument } from '@/database/schemas/transaction.schema';
import { Transaction } from '@domain/order/entities/transaction.entity';
import { ITransactionRepository } from '@domain/order/ports/i-transaction.repository';
import { TransactionMapper } from './transaction.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

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

  async findByTransactionId(
    transactionId: string,
  ): Promise<Transaction | null> {
    const doc = await this.model.findOne({ transactionId }).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async save(transaction: Transaction): Promise<void> {
    const persistence = this.mapper.toPersistence(transaction);
    await this.model
      .findByIdAndUpdate(persistence._id, persistence, { upsert: true })
      .exec();
  }
}
