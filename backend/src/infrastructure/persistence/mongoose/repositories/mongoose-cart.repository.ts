import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartDocument } from '@/database/schemas/cart.schema';
import { Cart } from '@domain/cart/entities/cart.entity';
import { ICartRepository } from '@domain/cart/ports/i-cart.repository';
import { CartMapper } from '../mappers/cart.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseCartRepository implements ICartRepository {
  constructor(
    @InjectModel(CartDocument.name)
    private readonly cartModel: Model<CartDocument>,
  ) {}

  async findByStudentId(studentId: UniqueId): Promise<Cart | null> {
    const doc = await this.cartModel.findOne({ studentId: studentId.value }).lean().exec();
    return doc ? CartMapper.toDomain(doc as CartDocument) : null;
  }

  async save(cart: Cart): Promise<void> {
    const data = CartMapper.toPersistence(cart);
    await this.cartModel.findByIdAndUpdate(data._id, data, { upsert: true }).exec();
  }
}
