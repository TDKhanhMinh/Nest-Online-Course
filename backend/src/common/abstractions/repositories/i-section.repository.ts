import { Section } from '@/api/course/entities/section.entity';

export const ISectionRepository = Symbol('ISectionRepository');

export interface ISectionRepository {
  findById(id: string): Promise<Section | null>;
  findByCourseId(courseId: string): Promise<Section[]>;
  save(section: Section): Promise<void>;
  delete(id: string): Promise<void>;
}
