import { Course } from '@/api/course/entities/course.entity';
import { UniqueId } from '@/common/types/unique-id.vo';
import { PageOptionsDto } from '@/common/pagination/offset/page-options.dto';
import { PageDto } from '@/common/pagination/offset/page.dto';
import { CursorOptionsDto } from '@/common/pagination/cursor/cursor-options.dto';
import { CursorPageDto } from '@/common/pagination/cursor/cursor-page.dto';

export interface ICourseRepository {
  findById(id: UniqueId): Promise<Course | null>;
  findByIdOrThrow(id: UniqueId): Promise<Course>;
  findAll(): Promise<Course[]>;
  findAllWithOffset(pageOptionsDto: PageOptionsDto): Promise<PageDto<Course>>;
  findAllWithCursor(cursorOptionsDto: CursorOptionsDto): Promise<CursorPageDto<Course>>;
  findByInstructorId(instructorId: string, pageOptionsDto: PageOptionsDto): Promise<PageDto<Course>>;
  findAdminCourses(pageOptionsDto: any): Promise<PageDto<Course>>;
  existsBySlug(slug: string): Promise<boolean>;
  save(course: Course): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}

export const COURSE_REPOSITORY = Symbol('ICourseRepository');
