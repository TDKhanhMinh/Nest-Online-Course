import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SectionDocument } from '@/database/schemas/section.schema';
import { Section } from '@/api/course/entities/section.entity';
import { ISectionRepository } from '@/common/abstractions/repositories/i-section.repository';
import { SectionMapper } from '@/api/course/section.mapper';

@Injectable()
export class SectionRepository implements ISectionRepository {
  constructor(
    @InjectModel(SectionDocument.name)
    private readonly model: Model<SectionDocument>,
    private readonly mapper: SectionMapper,
  ) {}

  async findById(id: string): Promise<Section | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findByCourseId(courseId: string): Promise<Section[]> {
    const docs = await this.model
      .find({ courseId })
      .sort({ orderIndex: 1 })
      .exec();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async save(section: Section): Promise<void> {
    const persistence = this.mapper.toPersistence(section);
    await this.model
      .findByIdAndUpdate(persistence._id, persistence, { upsert: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
