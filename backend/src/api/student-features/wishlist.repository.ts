import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WishlistDocument } from '@/database/schemas/wishlist.schema';
import { Wishlist } from '@/api/student-features/entities/wishlist.entity';
import { IWishlistRepository } from '@/common/abstractions/repositories/i-wishlist.repository';
import { WishlistMapper } from '@/api/student-features/wishlist.mapper';

@Injectable()
export class WishlistRepository implements IWishlistRepository {
  constructor(
    @InjectModel(WishlistDocument.name)
    private readonly model: Model<WishlistDocument>,
    private readonly mapper: WishlistMapper,
  ) {}

  async findByUserId(userId: string): Promise<Wishlist[]> {
    const docs = await this.model.find({ userId }).exec();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findOne(userId: string, courseId: string): Promise<Wishlist | null> {
    const doc = await this.model.findOne({ userId, courseId }).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async save(wishlist: Wishlist): Promise<void> {
    const persistence = this.mapper.toPersistence(wishlist);
    await this.model
      .findByIdAndUpdate(persistence._id, persistence, { upsert: true })
      .exec();
  }

  async delete(userId: string, courseId: string): Promise<void> {
    await this.model.deleteOne({ userId, courseId }).exec();
  }
}
