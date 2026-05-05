import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LectureDocument } from '@/database/schemas/lecture.schema';
import { Lecture } from '@/api/course/entities/lecture.entity';
import { ILectureRepository } from '@/common/abstractions/repositories/i-lecture.repository';
import { LectureMapper } from '@/api/course/lecture.mapper';

@Injectable()
export class LectureRepository implements ILectureRepository {
  constructor(
    @InjectModel(LectureDocument.name) private readonly model: Model<LectureDocument>,
    private readonly mapper: LectureMapper,
  ) {}

  async findById(id: string): Promise<Lecture | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findBySectionId(sectionId: string): Promise<Lecture[]> {
    const docs = await this.model.find({ sectionId }).sort({ orderIndex: 1 }).exec();
    return docs.map(doc => this.mapper.toDomain(doc));
  }

  async save(lecture: Lecture): Promise<void> {
    const persistence = this.mapper.toPersistence(lecture);
    await this.model.findByIdAndUpdate(persistence._id, persistence, { upsert: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
