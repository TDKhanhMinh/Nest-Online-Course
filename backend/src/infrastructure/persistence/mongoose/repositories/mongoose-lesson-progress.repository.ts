import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LessonProgress } from '@domain/enrollment/entities/lesson-progress.entity';
import { LessonProgressDocument } from '@/database/schemas/lesson-progress.schema';
import { ILessonProgressRepository } from '@domain/course/ports/i-lesson-progress.repository';
import { LessonProgressMapper } from '../mappers/lesson-progress.mapper';

import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseLessonProgressRepository implements ILessonProgressRepository {
  constructor(
    @InjectModel(LessonProgressDocument.name)
    private readonly lessonProgressModel: Model<LessonProgressDocument>,
  ) {}

  async findByEnrollmentId(enrollmentId: UniqueId): Promise<LessonProgress[]> {
    const docs = await this.lessonProgressModel.find({ enrollmentId: enrollmentId.value }).exec();
    return docs.map((doc) => LessonProgressMapper.toDomain(doc));
  }

  async findOne(enrollmentId: UniqueId, lessonId: UniqueId): Promise<LessonProgress | null> {
    const doc = await this.lessonProgressModel.findOne({ 
      enrollmentId: enrollmentId.value, 
      lessonId: lessonId.value 
    }).exec();
    if (!doc) return null;
    return LessonProgressMapper.toDomain(doc);
  }

  async save(progress: LessonProgress): Promise<void> {
    const persistenceData = LessonProgressMapper.toPersistence(progress);
    await this.lessonProgressModel
      .findByIdAndUpdate(progress.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }
}
