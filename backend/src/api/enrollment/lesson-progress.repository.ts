import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LessonProgressDocument } from '@/database/schemas/lesson-progress.schema';
import { LessonProgress } from '@/api/enrollment/entities/lesson-progress.entity';
import { ILessonProgressRepository } from '@/common/abstractions/repositories/i-lesson-progress.repository';
import { LessonProgressMapper } from '@/api/enrollment/lesson-progress.mapper';

@Injectable()
export class LessonProgressRepository implements ILessonProgressRepository {
  constructor(
    @InjectModel(LessonProgressDocument.name)
    private readonly model: Model<LessonProgressDocument>,
    private readonly mapper: LessonProgressMapper,
  ) {}

  async findByEnrollmentId(enrollmentId: string): Promise<LessonProgress[]> {
    const docs = await this.model.find({ enrollmentId }).exec();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findOne(enrollmentId: string, lessonId: string): Promise<LessonProgress | null> {
    const doc = await this.model.findOne({ enrollmentId, lessonId }).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async save(progress: LessonProgress): Promise<void> {
    const persistence = this.mapper.toPersistence(progress);
    await this.model
      .findByIdAndUpdate(persistence._id, persistence, { upsert: true })
      .exec();
  }
}
