import { Injectable, Inject, NotFoundException } from '@nestjs/common';
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
import { Section } from './entities/section.entity';
import { Lesson } from './entities/lesson.entity';
import { Review } from './entities/review.entity';
import {
  CreateSectionDto,
  UpdateSectionDto,
  CreateLessonDto,
  UpdateLessonDto,
} from './dto/course-content.dto';
import { CreateReviewDto } from './dto/review.dto';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';

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
    dto: CreateSectionDto,
  ): Promise<Section> {
    const course = await this.courseRepo.findByIdOrThrow(
      new UniqueId(courseId),
    );

    const section = Section.create({
      courseId: course.id.value,
      title: dto.title,
      orderIndex: dto.orderIndex,
    });

    await this.sectionRepo.save(section);
    return section;
  }

  async updateSection(
    sectionId: string,
    dto: UpdateSectionDto,
  ): Promise<Section> {
    const section = await this.sectionRepo.findById(sectionId);
    if (!section) throw new NotFoundException('Section not found');

    section.update(dto);

    await this.sectionRepo.save(section);
    return section;
  }

  async deleteSection(sectionId: string): Promise<void> {
    await this.sectionRepo.delete(sectionId);
  }

  async createLesson(
    sectionId: string,
    dto: CreateLessonDto,
  ): Promise<Lesson> {
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
    lessonId: string,
    dto: UpdateLessonDto,
  ): Promise<Lesson> {
    const lesson = await this.lessonRepo.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');

    lesson.update(dto);

    await this.lessonRepo.save(lesson);
    return lesson;
  }

  async deleteLesson(lessonId: string): Promise<void> {
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
