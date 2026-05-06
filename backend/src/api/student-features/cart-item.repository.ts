import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItemDocument } from '@/database/schemas/cart-item.schema';
import { CartItem } from '@/api/student-features/entities/cart-item.entity';
import { ICartItemRepository } from '@/common/abstractions/repositories/i-cart-item.repository';
import { CartItemMapper } from '@/api/student-features/cart-item.mapper';

@Injectable()
export class CartItemRepository implements ICartItemRepository {
  constructor(
    @InjectModel(CartItemDocument.name)
    private readonly model: Model<CartItemDocument>,
    private readonly mapper: CartItemMapper,
  ) {}

  async findByUserId(userId: string): Promise<CartItem[]> {
    const docs = await this.model.find({ userId }).exec();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findOne(userId: string, courseId: string): Promise<CartItem | null> {
    const doc = await this.model.findOne({ userId, courseId }).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async save(cartItem: CartItem): Promise<void> {
    const persistence = this.mapper.toPersistence(cartItem);
    await this.model
      .findByIdAndUpdate(persistence._id, persistence, { upsert: true })
      .exec();
  }

  async delete(userId: string, courseId: string): Promise<void> {
    await this.model.deleteOne({ userId, courseId }).exec();
  }

  async clear(userId: string): Promise<void> {
    await this.model.deleteMany({ userId }).exec();
  }
}
