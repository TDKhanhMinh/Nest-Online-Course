import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '@domain/course/entities/review.entity';
import { ReviewDocument } from '@/database/schemas/review.schema';
import { IReviewRepository } from '@domain/course/ports/i-review.repository';
import { ReviewMapper } from '../mappers/review.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseReviewRepository implements IReviewRepository {
  constructor(
    @InjectModel(ReviewDocument.name) private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async findById(id: UniqueId): Promise<Review | null> {
    const doc = await this.reviewModel.findById(id.value).exec();
    if (!doc) return null;
    return ReviewMapper.toDomain(doc);
  }

  async findByCourseId(courseId: UniqueId): Promise<Review[]> {
    const docs = await this.reviewModel.find({ courseId: courseId.value }).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => ReviewMapper.toDomain(doc));
  }

  async save(review: Review): Promise<void> {
    const persistenceData = ReviewMapper.toPersistence(review);
    await this.reviewModel
      .findByIdAndUpdate(review.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async delete(id: UniqueId): Promise<void> {
    await this.reviewModel.findByIdAndDelete(id.value).exec();
  }
}
