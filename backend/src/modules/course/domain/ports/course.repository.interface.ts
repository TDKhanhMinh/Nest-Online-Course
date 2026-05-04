import { Course } from '../entities/course.entity';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';

export interface ICourseRepository {
  findById(id: UniqueId): Promise<Course | null>;
  findByIdOrThrow(id: UniqueId): Promise<Course>;
  findAll(): Promise<Course[]>;
  save(course: Course): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}

export const COURSE_REPOSITORY = Symbol('ICourseRepository');
