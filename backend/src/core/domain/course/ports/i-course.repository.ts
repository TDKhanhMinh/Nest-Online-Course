import { Course } from '@domain/course/entities/course.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { PageDto } from '@shared/pagination/offset/page.dto';
import { CursorOptionsDto } from '@shared/pagination/cursor/cursor-options.dto';
import { CursorPageDto } from '@shared/pagination/cursor/cursor-page.dto';

export interface ICourseRepository {
  findById(id: UniqueId): Promise<Course | null>;
  findByIdOrThrow(id: UniqueId): Promise<Course>;
  findBySlug(slug: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
  findAllWithOffset(
    pageOptionsDto: PageOptionsDto,
    extraFilter?: any,
    sort?: any,
  ): Promise<PageDto<Course>>;
  findAllWithCursor(
    cursorOptionsDto: CursorOptionsDto,
    extraFilter?: any,
    sort?: any,
  ): Promise<CursorPageDto<Course>>;
  findByInstructorId(instructorId: string, query: any): Promise<PageDto<Course>>;
  findAdminCourses(queryDto: any): Promise<PageDto<Course>>;
  existsBySlug(slug: string): Promise<boolean>;
  save(course: Course): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}

export const ICOURSE_REPOSITORY = Symbol('ICourseRepository');



