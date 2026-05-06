import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartDocument } from '@/database/schemas/cart.schema';
import { Cart } from '@/api/cart/entities/cart.entity';
import { ICartRepository } from '@/common/abstractions/repositories/i-cart.repository';
import { CartMapper } from '@/api/cart/cart.mapper';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(
    @InjectModel(CartDocument.name)
    private readonly cartModel: Model<CartDocument>,
    private readonly mapper: CartMapper,
  ) {}

  async findByStudentId(studentId: UniqueId): Promise<Cart | null> {
    const doc = await this.cartModel.findOne({ studentId: studentId.value }).lean().exec();
    return doc ? this.mapper.toDomain(doc as CartDocument) : null;
  }

  async save(cart: Cart): Promise<void> {
    const data = this.mapper.toPersistence(cart);
    await this.cartModel.findByIdAndUpdate(data._id, data, { upsert: true }).exec();
  }
}
