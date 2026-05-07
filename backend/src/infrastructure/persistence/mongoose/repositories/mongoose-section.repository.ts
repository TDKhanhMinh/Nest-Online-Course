import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section } from '@domain/course/entities/section.entity';
import { SectionDocument } from '@/database/schemas/section.schema';
import { ISectionRepository } from '@domain/course/ports/i-section.repository';
import { SectionMapper } from '../mappers/section.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseSectionRepository implements ISectionRepository {
  constructor(
    @InjectModel(SectionDocument.name) private readonly sectionModel: Model<SectionDocument>,
  ) {}

  async findById(id: UniqueId): Promise<Section | null> {
    const doc = await this.sectionModel.findById(id.value).exec();
    if (!doc) return null;
    return SectionMapper.toDomain(doc);
  }

  async findByCourseId(courseId: UniqueId): Promise<Section[]> {
    const docs = await this.sectionModel.find({ courseId: courseId.value }).sort({ orderIndex: 1 }).exec();
    return docs.map((doc) => SectionMapper.toDomain(doc));
  }

  async save(section: Section): Promise<void> {
    const persistenceData = SectionMapper.toPersistence(section);
    await this.sectionModel
      .findByIdAndUpdate(section.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async delete(id: UniqueId): Promise<void> {
    await this.sectionModel.findByIdAndDelete(id.value).exec();
  }
}
