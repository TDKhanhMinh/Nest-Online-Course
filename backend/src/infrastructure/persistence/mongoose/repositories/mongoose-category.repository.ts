import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '@domain/course/entities/category.entity';
import { CategoryDocument } from '@/database/schemas/category.schema';
import { ICategoryRepository } from '@domain/course/ports/i-category.repository';
import { CategoryMapper } from '../mappers/category.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseCategoryRepository implements ICategoryRepository {
  constructor(
    @InjectModel(CategoryDocument.name) private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async findById(id: UniqueId): Promise<Category | null> {
    const doc = await this.categoryModel.findById(id.value).exec();
    if (!doc) return null;
    return CategoryMapper.toDomain(doc);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const doc = await this.categoryModel.findOne({ slug }).exec();
    if (!doc) return null;
    return CategoryMapper.toDomain(doc);
  }

  async findAll(): Promise<Category[]> {
    const docs = await this.categoryModel.find().sort({ name: 1 }).exec();
    return docs.map((doc) => CategoryMapper.toDomain(doc));
  }

  async save(category: Category): Promise<void> {
    const persistenceData = CategoryMapper.toPersistence(category);
    await this.categoryModel
      .findByIdAndUpdate(category.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async delete(id: UniqueId): Promise<void> {
    await this.categoryModel.findByIdAndDelete(id.value).exec();
  }
}
