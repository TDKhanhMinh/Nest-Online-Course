import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ICourseRepository, COURSE_REPOSITORY } from '@/common/abstractions/repositories/i-course.repository';
import { IEnrollmentRepository, ENROLLMENT_REPOSITORY } from '@/common/abstractions/repositories/i-enrollment.repository';
import { ISectionRepository } from '@/common/abstractions/repositories/i-section.repository';
import { ILectureRepository } from '@/common/abstractions/repositories/i-lecture.repository';
import { IReviewRepository } from '@/common/abstractions/repositories/i-review.repository';
import { UniqueId } from '@/common/types/unique-id.vo';
import { Section } from './entities/section.entity';
import { Lecture } from './entities/lecture.entity';
import { Review } from './entities/review.entity';
import { CreateSectionDto, UpdateSectionDto, CreateLectureDto, UpdateLectureDto } from './dto/course-content.dto';
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

    @Inject(ILectureRepository)
    private readonly lectureRepo: ILectureRepository,

    @Inject(IReviewRepository)
    private readonly reviewRepo: IReviewRepository,

    private readonly eventEmitter: EventEmitter2,
  ) { }

  // ... (previous methods)

  async createReview(userId: string, dto: CreateReviewDto): Promise<Review> {
    const courseId = new UniqueId(dto.courseId);
    const course = await this.courseRepo.findByIdOrThrow(courseId);

    // Check if user is enrolled
    const enrollment = await this.enrollmentRepo.findByStudentAndCourse(new UniqueId(userId), courseId);
    if (!enrollment) {
      throw new DomainException(ErrorCode.NOT_ENROLLED, 'You must be enrolled to review this course');
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

  async createSection(courseId: string, dto: CreateSectionDto): Promise<Section> {
    const course = await this.courseRepo.findByIdOrThrow(new UniqueId(courseId));

    const section = Section.create({
      courseId: course.id.value,
      title: dto.title,
      order: dto.order,
    });

    await this.sectionRepo.save(section);
    return section;
  }

  async updateSection(sectionId: string, dto: UpdateSectionDto): Promise<Section> {
    const section = await this.sectionRepo.findById(sectionId);
    if (!section) throw new NotFoundException('Section not found');

    section.update(dto);

    await this.sectionRepo.save(section);
    return section;
  }

  async deleteSection(sectionId: string): Promise<void> {
    await this.sectionRepo.delete(sectionId);
  }

  async createLecture(sectionId: string, dto: CreateLectureDto): Promise<Lecture> {
    const section = await this.sectionRepo.findById(sectionId);
    if (!section) throw new NotFoundException('Section not found');

    const lecture = Lecture.create({
      sectionId: section.id.value,
      title: dto.title,
      content: dto.content,
      type: dto.type,
      order: dto.order,
      videoUrl: dto.videoUrl,
      duration: dto.duration,
    });

    await this.lectureRepo.save(lecture);
    return lecture;
  }

  async updateLecture(lectureId: string, dto: UpdateLectureDto): Promise<Lecture> {
    const lecture = await this.lectureRepo.findById(lectureId);
    if (!lecture) throw new NotFoundException('Lecture not found');

    lecture.update(dto);

    await this.lectureRepo.save(lecture);
    return lecture;
  }

  async deleteLecture(lectureId: string): Promise<void> {
    await this.lectureRepo.delete(lectureId);
  }

  async getCourseFullContent(courseId: string) {
    const course = await this.courseRepo.findByIdOrThrow(new UniqueId(courseId));
    const sections = await this.sectionRepo.findByCourseId(courseId);

    const sectionsWithLectures = await Promise.all(
      sections.sort((a, b) => a.order - b.order).map(async (section) => {
        const lectures = await this.lectureRepo.findBySectionId(section.id.value);
        return {
          id: section.id.value,
          courseId: section.courseId,
          title: section.title,
          order: section.order,
          lectures: lectures.sort((a, b) => a.order - b.order).map(l => ({
            id: l.id.value,
            sectionId: l.sectionId,
            title: l.title,
            content: l.content,
            type: l.type,
            order: l.order,
            videoUrl: l.videoUrl,
            duration: l.duration,
            isPreview: l.isPreview,
          }))
        };
      })
    );

    return {
      courseId: course.id.value,
      title: course.title.value,
      sections: sectionsWithLectures
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
