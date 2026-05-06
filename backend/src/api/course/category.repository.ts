import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDocument } from '@/database/schemas/category.schema';
import { Category } from '@/api/course/entities/category.entity';
import { ICategoryRepository } from '@/common/abstractions/repositories/i-category.repository';
import { CategoryMapper } from '@/api/course/category.mapper';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectModel(CategoryDocument.name)
    private readonly model: Model<CategoryDocument>,
    private readonly mapper: CategoryMapper,
  ) {}

  async findById(id: string): Promise<Category | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findAll(): Promise<Category[]> {
    const docs = await this.model.find().exec();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const doc = await this.model.findOne({ slug }).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async save(category: Category): Promise<void> {
    const persistence = this.mapper.toPersistence(category);
    await this.model
      .findByIdAndUpdate(persistence._id, persistence, { upsert: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
