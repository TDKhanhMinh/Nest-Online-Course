import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewDocument } from '@/database/schemas/review.schema';
import { Review } from '@/api/course/entities/review.entity';
import { IReviewRepository } from '@/common/abstractions/repositories/i-review.repository';
import { ReviewMapper } from '@/api/course/review.mapper';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(
    @InjectModel(ReviewDocument.name) private readonly model: Model<ReviewDocument>,
    private readonly mapper: ReviewMapper,
  ) {}

  async findById(id: string): Promise<Review | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findByCourseId(courseId: string): Promise<Review[]> {
    const docs = await this.model.find({ courseId }).sort({ createdAt: -1 }).exec();
    return docs.map(doc => this.mapper.toDomain(doc));
  }

  async save(review: Review): Promise<void> {
    const persistence = this.mapper.toPersistence(review);
    await this.model.findByIdAndUpdate(persistence._id, persistence, { upsert: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
