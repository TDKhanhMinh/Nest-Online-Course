import { TransactionDocument } from '@/database/schemas/transaction.schema';
import { Transaction } from '@domain/order/entities/transaction.entity';
import { ITransactionRepository } from '@domain/order/ports/i-transaction.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionStatus } from '@shared/types/transaction-status.enum';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Model } from 'mongoose';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class MongooseTransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionDocument.name) private readonly transactionModel: Model<TransactionDocument>,
  ) {
    // Drop the deprecated unique index transactionId_1 if it still exists in MongoDB
    this.transactionModel.collection.dropIndex('transactionId_1')
      .catch((err) => {
        // Safe to ignore if the index was already dropped or doesn't exist (IndexNotFound = code 27)
        if (err.code !== 27 && err.codeName !== 'IndexNotFound') {
          console.warn('Could not drop deprecated index transactionId_1:', err.message);
        }
      });
  }

  async findById(id: UniqueId): Promise<Transaction | null> {
    const doc = await this.transactionModel.findById(id.value).exec();
    if (!doc) return null;
    return TransactionMapper.toDomain(doc);
  }

  async findByOrderId(orderId: UniqueId): Promise<Transaction[]> {
    const docs = await this.transactionModel.find({ orderId: orderId.value }).exec();
    return docs.map((doc) => TransactionMapper.toDomain(doc));
  }

  async findPendingByOrderId(orderId: UniqueId): Promise<Transaction | null> {
    const doc = await this.transactionModel
      .findOne({ orderId: orderId.value, status: TransactionStatus.PENDING })
      .exec();
    if (!doc) return null;
    return TransactionMapper.toDomain(doc);
  }

  async findByGatewayOrderId(gatewayOrderId: string): Promise<Transaction | null> {
    const doc = await this.transactionModel.findOne({ gatewayOrderId }).exec();
    if (!doc) return null;
    return TransactionMapper.toDomain(doc);
  }

  async findByTxnRef(txnRef: string): Promise<Transaction | null> {
    // txnRef is the ID of our transaction (stored as _id in mongo)
    const doc = await this.transactionModel.findById(txnRef).exec();
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
