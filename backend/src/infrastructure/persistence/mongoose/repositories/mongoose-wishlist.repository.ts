import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WishlistDocument } from '@/database/schemas/wishlist.schema';
import { Wishlist } from '@domain/student-features/entities/wishlist.entity';
import { IWishlistRepository } from '@domain/student-features/ports/i-wishlist.repository';
import { WishlistMapper } from '../mappers/wishlist.mapper';

@Injectable()
export class MongooseWishlistRepository implements IWishlistRepository {
  constructor(
    @InjectModel(WishlistDocument.name)
    private readonly model: Model<WishlistDocument>,
  ) {}

  async findByUserId(userId: string): Promise<Wishlist[]> {
    const docs = await this.model.find({ userId }).exec();
    return docs.map((doc) => WishlistMapper.toDomain(doc));
  }

  async findOne(userId: string, courseId: string): Promise<Wishlist | null> {
    const doc = await this.model.findOne({ userId, courseId }).exec();
    return doc ? WishlistMapper.toDomain(doc) : null;
  }

  async save(wishlist: Wishlist): Promise<void> {
    const persistence = WishlistMapper.toPersistence(wishlist);
    await this.model
      .findByIdAndUpdate(persistence._id, persistence, { upsert: true })
      .exec();
  }

  async delete(userId: string, courseId: string): Promise<void> {
    await this.model.deleteOne({ userId, courseId }).exec();
  }
}



