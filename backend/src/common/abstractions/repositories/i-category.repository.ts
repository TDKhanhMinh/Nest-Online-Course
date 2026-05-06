import { Category } from '@/api/course/entities/category.entity';

export const ICATEGORY_REPOSITORY = 'ICATEGORY_REPOSITORY';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findBySlug(slug: string): Promise<Category | null>;
  save(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
}
