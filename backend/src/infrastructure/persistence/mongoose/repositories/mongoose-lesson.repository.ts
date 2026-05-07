import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson } from '@domain/course/entities/lesson.entity';
import { LessonDocument } from '@/database/schemas/lesson.schema';
import { ILessonRepository } from '@domain/course/ports/i-lesson.repository';
import { LessonMapper } from '../mappers/lesson.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseLessonRepository implements ILessonRepository {
  constructor(
    @InjectModel(LessonDocument.name) private readonly lessonModel: Model<LessonDocument>,
  ) {}

  async findById(id: UniqueId): Promise<Lesson | null> {
    const doc = await this.lessonModel.findById(id.value).exec();
    if (!doc) return null;
    return LessonMapper.toDomain(doc);
  }

  async findBySectionId(sectionId: UniqueId): Promise<Lesson[]> {
    const docs = await this.lessonModel.find({ sectionId: sectionId.value }).sort({ orderIndex: 1 }).exec();
    return docs.map((doc) => LessonMapper.toDomain(doc));
  }

  async save(lesson: Lesson): Promise<void> {
    const persistenceData = LessonMapper.toPersistence(lesson);
    await this.lessonModel
      .findByIdAndUpdate(lesson.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async delete(id: UniqueId): Promise<void> {
    await this.lessonModel.findByIdAndDelete(id.value).exec();
  }
}
