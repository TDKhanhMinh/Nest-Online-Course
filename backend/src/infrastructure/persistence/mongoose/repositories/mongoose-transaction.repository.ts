import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '@domain/order/entities/transaction.entity';
import { TransactionDocument } from '@/database/schemas/transaction.schema';
import { ITransactionRepository } from '@domain/order/ports/i-transaction.repository';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseTransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionDocument.name) private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async findById(id: UniqueId): Promise<Transaction | null> {
    const doc = await this.transactionModel.findById(id.value).exec();
    if (!doc) return null;
    return TransactionMapper.toDomain(doc);
  }

  async findByTransactionId(transactionId: string): Promise<Transaction | null> {
    const doc = await this.transactionModel.findOne({ transactionId }).exec();
    if (!doc) return null;
    return TransactionMapper.toDomain(doc);
  }

  async save(transaction: Transaction): Promise<void> {
    const persistenceData = TransactionMapper.toPersistence(transaction);
    await this.transactionModel
      .findByIdAndUpdate(transaction.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }
}
