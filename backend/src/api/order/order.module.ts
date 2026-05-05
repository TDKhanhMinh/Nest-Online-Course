import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDocument, OrderSchema } from '@/database/schemas/order.schema';
import { OrderItemDocument, OrderItemSchema } from '@/database/schemas/order-item.schema';
import { OrderRepository } from '@/api/order/order.repository';
import { OrderMapper } from '@/api/order/order.mapper';
import { OrderItemMapper } from '@/api/order/order-item.mapper';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
      { name: OrderItemDocument.name, schema: OrderItemSchema },
    ]),
  ],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    OrderMapper,
    OrderItemMapper,
  ],
  exports: [ORDER_REPOSITORY],
})
export class OrderModule {}
