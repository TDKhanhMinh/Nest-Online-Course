import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LessonDocument } from '@/database/schemas/lesson.schema';
import { Lesson } from '@/api/course/entities/lesson.entity';
import { ILessonRepository } from '@/common/abstractions/repositories/i-lesson.repository';
import { LessonMapper } from '@/api/course/lesson.mapper';

@Injectable()
export class LessonRepository implements ILessonRepository {
  constructor(
    @InjectModel(LessonDocument.name)
    private readonly model: Model<LessonDocument>,
    private readonly mapper: LessonMapper,
  ) {}

  async findById(id: string): Promise<Lesson | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findBySectionId(sectionId: string): Promise<Lesson[]> {
    const docs = await this.model
      .find({ sectionId })
      .sort({ orderIndex: 1 })
      .exec();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async save(lesson: Lesson): Promise<void> {
    const persistence = this.mapper.toPersistence(lesson);
    await this.model
      .findByIdAndUpdate(persistence._id, persistence, { upsert: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
