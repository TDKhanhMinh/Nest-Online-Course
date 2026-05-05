import { Lecture } from '@/api/course/entities/lecture.entity';

export const ILectureRepository = Symbol('ILectureRepository');

export interface ILectureRepository {
  findById(id: string): Promise<Lecture | null>;
  findBySectionId(sectionId: string): Promise<Lecture[]>;
  save(lecture: Lecture): Promise<void>;
  delete(id: string): Promise<void>;
}
