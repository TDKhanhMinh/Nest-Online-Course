import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ICourseRepository,
  COURSE_REPOSITORY,
} from '@/common/abstractions/repositories/i-course.repository';
import {
  IEnrollmentRepository,
  ENROLLMENT_REPOSITORY,
} from '@/common/abstractions/repositories/i-enrollment.repository';
import { ISectionRepository } from '@/common/abstractions/repositories/i-section.repository';
import { ILessonRepository } from '@/common/abstractions/repositories/i-lesson.repository';
import { IReviewRepository } from '@/common/abstractions/repositories/i-review.repository';
import { UniqueId } from '@/common/types/unique-id.vo';
import { Course } from './entities/course.entity';
import { Section } from './entities/section.entity';
import { Lesson } from './entities/lesson.entity';
import { Review } from './entities/review.entity';
import {
  CreateSectionDto,
  UpdateSectionDto,
  CreateLessonDto,
  UpdateLessonDto,
} from './dto/course-content.dto';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CreateReviewDto } from './dto/review.dto';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';
import { CourseTitle } from './value-objects/course-title.vo';
import { CourseStatus } from '@/common/types/course-status.enum';
import { CourseLevel } from '@/common/types/course-level.enum';
import { PageOptionsDto } from '@/common/pagination/offset/page-options.dto';

@Injectable()
export class CourseService {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,

    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,

    @Inject(ISectionRepository)
    private readonly sectionRepo: ISectionRepository,

    @Inject(ILessonRepository)
    private readonly lessonRepo: ILessonRepository,

    @Inject(IReviewRepository)
    private readonly reviewRepo: IReviewRepository,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  // --- Instructor Course Management ---

  async createCourse(instructorId: string, dto: CreateCourseDto): Promise<Course> {
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

  async updateCourse(
    instructorId: string,
    courseId: string,
    dto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.validateOwnership(courseId, instructorId);

    course.update({
      title: dto.title ? new CourseTitle(dto.title) : undefined,
      description: dto.description,
      price: dto.price,
      categoryId: dto.categoryId ? new UniqueId(dto.categoryId) : undefined,
      thumbnailUrl: dto.thumbnailUrl,
      level: dto.level,
      language: dto.language,
    });

    if (dto.status) {
      course.updateStatus(dto.status);
    }

    await this.courseRepo.save(course);
    return course;
  }

  async deleteCourse(instructorId: string, courseId: string): Promise<void> {
    await this.validateOwnership(courseId, instructorId);
    await this.courseRepo.delete(new UniqueId(courseId));
  }

  async getInstructorCourses(
    instructorId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<any> {
    return this.courseRepo.findByInstructorId(instructorId, pageOptionsDto);
  }

  // --- Admin Course Management ---

  async adminGetAllCourses(pageOptions: any): Promise<any> {
    return this.courseRepo.findAdminCourses(pageOptions);
  }

  async adminUpdateCourseStatus(courseId: string, status: CourseStatus): Promise<Course> {
    const course = await this.courseRepo.findByIdOrThrow(new UniqueId(courseId));
    course.updateStatus(status);
    await this.courseRepo.save(course);
    return course;
  }

  async adminDeleteCourse(courseId: string): Promise<void> {
    await this.courseRepo.delete(new UniqueId(courseId));
  }

  private async validateOwnership(courseId: string, instructorId: string): Promise<Course> {
    const course = await this.courseRepo.findByIdOrThrow(new UniqueId(courseId));
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }
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

  // ... (previous methods)

  async createReview(userId: string, dto: CreateReviewDto): Promise<Review> {
    const courseId = new UniqueId(dto.courseId);
    const course = await this.courseRepo.findByIdOrThrow(courseId);

    // Check if user is enrolled
    const enrollment = await this.enrollmentRepo.findByStudentAndCourse(
      new UniqueId(userId),
      courseId,
    );
    if (!enrollment) {
      throw new DomainException(
        ErrorCode.NOT_ENROLLED,
        'You must be enrolled to review this course',
      );
    }

    const review = Review.create({
      courseId: course.id,
      studentId: new UniqueId(userId),
      rating: dto.rating,
      comment: dto.comment,
    });

    await this.reviewRepo.save(review);
    return review;
  }

  async getCourseReviews(courseId: string): Promise<Review[]> {
    return this.reviewRepo.findByCourseId(courseId);
  }

  // --- Course Content Management ---

  async createSection(
    courseId: string,
    instructorId: string,
    dto: CreateSectionDto,
  ): Promise<Section> {
    await this.validateOwnership(courseId, instructorId);

    const section = Section.create({
      courseId,
      title: dto.title,
      orderIndex: dto.orderIndex,
    });

    await this.sectionRepo.save(section);
    return section;
  }

  async updateSection(
    courseId: string,
    instructorId: string,
    sectionId: string,
    dto: UpdateSectionDto,
  ): Promise<Section> {
    await this.validateOwnership(courseId, instructorId);

    const section = await this.sectionRepo.findById(sectionId);
    if (!section) throw new NotFoundException('Section not found');

    section.update(dto);

    await this.sectionRepo.save(section);
    return section;
  }

  async deleteSection(
    courseId: string,
    instructorId: string,
    sectionId: string,
  ): Promise<void> {
    await this.validateOwnership(courseId, instructorId);
    await this.sectionRepo.delete(sectionId);
  }

  async createLesson(
    courseId: string,
    instructorId: string,
    sectionId: string,
    dto: CreateLessonDto,
  ): Promise<Lesson> {
    await this.validateOwnership(courseId, instructorId);

    const section = await this.sectionRepo.findById(sectionId);
    if (!section) throw new NotFoundException('Section not found');

    const lesson = Lesson.create({
      sectionId: section.id.value,
      title: dto.title,
      contentUrl: dto.contentUrl,
      textContent: dto.textContent,
      type: dto.type,
      orderIndex: dto.orderIndex,
      duration: dto.duration,
      isFreePreview: dto.isFreePreview,
    });

    await this.lessonRepo.save(lesson);
    return lesson;
  }

  async updateLesson(
    courseId: string,
    instructorId: string,
    lessonId: string,
    dto: UpdateLessonDto,
  ): Promise<Lesson> {
    await this.validateOwnership(courseId, instructorId);

    const lesson = await this.lessonRepo.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');

    lesson.update(dto);

    await this.lessonRepo.save(lesson);
    return lesson;
  }

  async deleteLesson(
    courseId: string,
    instructorId: string,
    lessonId: string,
  ): Promise<void> {
    await this.validateOwnership(courseId, instructorId);
    await this.lessonRepo.delete(lessonId);
  }


  async getCourseFullContent(courseId: string) {
    const course = await this.courseRepo.findByIdOrThrow(
      new UniqueId(courseId),
    );
    const sections = await this.sectionRepo.findByCourseId(courseId);

    const sectionsWithLessons = await Promise.all(
      sections
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(async (section) => {
          const lessons = await this.lessonRepo.findBySectionId(
            section.id.value,
          );
          return {
            id: section.id.value,
            courseId: section.courseId,
            title: section.title,
            orderIndex: section.orderIndex,
            lessons: lessons
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((l) => ({
                id: l.id.value,
                sectionId: l.sectionId,
                title: l.title,
                contentUrl: l.contentUrl,
                textContent: l.textContent,
                type: l.type,
                orderIndex: l.orderIndex,
                duration: l.duration,
                isFreePreview: l.isFreePreview,
              })),
          };
        }),
    );

    return {
      courseId: course.id.value,
      title: course.title.value,
      description: course.description,
      price: course.price,
      status: course.status,
      level: course.level,
      language: course.language,
      thumbnailUrl: course.thumbnailUrl,
      categoryId: course.categoryId.value,
      instructorId: course.instructorId.value,
      slug: course.slug,
      sections: sectionsWithLessons,
    };
  }

  // --- Existing Logic (Updated for new structure if needed) ---

  async getAllWithOffset(pageOptionsDto: any) {
    return this.courseRepo.findAllWithOffset(pageOptionsDto);
  }

  async getAllWithCursor(cursorOptionsDto: any) {
    return this.courseRepo.findAllWithCursor(cursorOptionsDto);
  }
}
