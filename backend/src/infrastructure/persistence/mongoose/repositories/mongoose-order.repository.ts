import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '@domain/order/entities/order.entity';
import { OrderItem } from '@domain/order/entities/order-item.entity';
import { OrderDocument } from '@/database/schemas/order.schema';
import { OrderItemDocument } from '@/database/schemas/order-item.schema';
import { IOrderRepository } from '@domain/order/ports/i-order.repository';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderItemMapper } from '../mappers/order-item.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseOrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(OrderDocument.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderItemDocument.name) private readonly orderItemModel: Model<OrderItemDocument>,
  ) {}

  async findById(id: UniqueId): Promise<Order | null> {
    const doc = await this.orderModel.findById(id.value).exec();
    if (!doc) return null;
    return OrderMapper.toDomain(doc);
  }

  async findByStudentId(studentId: UniqueId): Promise<Order[]> {
    const docs = await this.orderModel.find({ studentId: studentId.value }).exec();
    return docs.map((doc) => OrderMapper.toDomain(doc));
  }

  async save(order: Order, items: OrderItem[]): Promise<void> {
    // Save order
    const orderData = OrderMapper.toPersistence(order);
    await this.orderModel.findByIdAndUpdate(order.id.value, orderData, { upsert: true }).exec();

    // Save items
    const itemPromises = items.map((item) => {
      const itemData = OrderItemMapper.toPersistence(item);
      return this.orderItemModel.findByIdAndUpdate(item.id.value, itemData, { upsert: true }).exec();
    });
    await Promise.all(itemPromises);
  }
}
