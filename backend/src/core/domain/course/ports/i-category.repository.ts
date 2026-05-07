import { Category } from '@domain/course/entities/category.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const ICATEGORY_REPOSITORY = Symbol('ICategoryRepository');

export interface ICategoryRepository {
  findById(id: UniqueId): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findBySlug(slug: string): Promise<Category | null>;
  save(category: Category): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}



