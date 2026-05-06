import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionDocument } from '@/database/schemas/transaction.schema';
import { Transaction } from '@/api/order/entities/transaction.entity';
import { ITransactionRepository } from '@/common/abstractions/repositories/i-transaction.repository';
import { TransactionMapper } from '@/api/order/transaction.mapper';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionDocument.name)
    private readonly model: Model<TransactionDocument>,
    private readonly mapper: TransactionMapper,
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findByTransactionId(transactionId: string): Promise<Transaction | null> {
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
