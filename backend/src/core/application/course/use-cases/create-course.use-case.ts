import { Inject, Injectable } from '@nestjs/common';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { Course } from '@domain/course/entities/course.entity';
import { CourseTitle } from '@domain/course/value-objects/course-title.vo';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CourseStatus } from '@shared/types/course-status.enum';
import { CourseLevel } from '@shared/types/course-level.enum';
import { CreateCourseDto } from '../dto/course.dto';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(instructorId: string, dto: CreateCourseDto): Promise<Course> {
    // Generate unique slug
    let slug = this.generateSlug(dto.title);
    const isSlugTaken = await this.courseRepo.existsBySlug(slug);
    if (isSlugTaken) {
      slug = `${slug}-${Date.now()}`;
    }

    const course = Course.create({
      title: new CourseTitle(dto.title),
      slug,
      instructorId: new UniqueId(instructorId),
      categoryId: new UniqueId(dto.categoryId),
      description: dto.description,
      price: dto.price,
      thumbnailUrl: dto.thumbnailUrl,
      level: dto.level ?? CourseLevel.BEGINNER,
      language: dto.language ?? 'English',
      status: CourseStatus.DRAFT,
    });

    await this.courseRepo.save(course);
    return course;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
