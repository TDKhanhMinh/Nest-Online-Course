import { Section } from '@domain/course/entities/section.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const ISECTION_REPOSITORY = Symbol('ISectionRepository');

export interface ISectionRepository {
  findById(id: UniqueId): Promise<Section | null>;
  findByCourseId(courseId: UniqueId): Promise<Section[]>;
  save(section: Section): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}



