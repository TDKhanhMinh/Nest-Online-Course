import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDocument, OrderSchema } from '@/database/schemas/order.schema';
import {
  OrderItemDocument,
  OrderItemSchema,
} from '@/database/schemas/order-item.schema';
import {
  TransactionDocument,
  TransactionSchema,
} from '@/database/schemas/transaction.schema';
import { OrderRepository } from './order.repository';
import { OrderMapper } from './order.mapper';
import { OrderItemMapper } from './order-item.mapper';
import { TransactionRepository } from './transaction.repository';
import { TransactionMapper } from './transaction.mapper';
import { IOrderRepository, IORDER_REPOSITORY } from '@domain/order/ports/i-order.repository';
import { ITRANSACTION_REPOSITORY } from '@domain/order/ports/i-transaction.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
      { name: OrderItemDocument.name, schema: OrderItemSchema },
      { name: TransactionDocument.name, schema: TransactionSchema },
    ]),
  ],
  providers: [
    { provide: IORDER_REPOSITORY, useClass: OrderRepository },
    { provide: ITRANSACTION_REPOSITORY, useClass: TransactionRepository },
    OrderMapper,
    OrderItemMapper,
    TransactionMapper,
  ],
  exports: [IORDER_REPOSITORY, ITRANSACTION_REPOSITORY],
})
export class OrderPersistenceModule {}
