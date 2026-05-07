import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDocument } from '@/database/schemas/order.schema';
import { OrderItemDocument } from '@/database/schemas/order-item.schema';
import { Order } from '@domain/order/entities/order.entity';
import { OrderItem } from '@domain/order/entities/order-item.entity';
import { IOrderRepository } from '@domain/order/ports/i-order.repository';
import { OrderMapper } from './order.mapper';
import { OrderItemMapper } from './order-item.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(OrderDocument.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderItemDocument.name)
    private readonly itemModel: Model<OrderItemDocument>,
    private readonly orderMapper: OrderMapper,
    private readonly itemMapper: OrderItemMapper,
  ) {}

  async findById(id: UniqueId): Promise<Order | null> {
    const doc = await this.orderModel.findById(id.value).exec();
    return doc ? this.orderMapper.toDomain(doc) : null;
  }

  async findByStudentId(studentId: UniqueId): Promise<Order[]> {
    const docs = await this.orderModel
      .find({ studentId: studentId.value })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => this.orderMapper.toDomain(doc));
  }

  async save(order: Order, items: OrderItem[]): Promise<void> {
    const orderPersistence = this.orderMapper.toPersistence(order);
    await this.orderModel
      .findByIdAndUpdate(orderPersistence._id, orderPersistence, {
        upsert: true,
      })
      .exec();

    for (const item of items) {
      const itemPersistence = this.itemMapper.toPersistence(item);
      await this.itemModel
        .findByIdAndUpdate(itemPersistence._id, itemPersistence, {
          upsert: true,
        })
        .exec();
    }
  }
}
