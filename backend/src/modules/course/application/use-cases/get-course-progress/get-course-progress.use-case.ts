import { Injectable, Inject } from '@nestjs/common';
import { ICourseRepository, COURSE_REPOSITORY } from '../../../domain/ports/course.repository.interface';
import { IEnrollmentRepository, ENROLLMENT_REPOSITORY } from '@/modules/enrollment/domain/ports/enrollment.repository.interface';
import { GetCourseProgressQuery } from './get-course-progress.query';
import { GetCourseProgressResult } from './get-course-progress.result';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { NotEnrolledException } from '@/modules/enrollment/domain/exceptions/not-enrolled.exception';

@Injectable()
export class GetCourseProgressUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,

    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,
  ) {}

  async execute(query: GetCourseProgressQuery): Promise<GetCourseProgressResult> {
    const courseId  = new UniqueId(query.courseId);
    const studentId = new UniqueId(query.studentId);

    const enrollment = await this.enrollmentRepo.findByStudentAndCourse(studentId, courseId);
    if (!enrollment?.isActive()) {
      throw new NotEnrolledException(query.studentId, query.courseId);
    }

    const course = await this.courseRepo.findByIdOrThrow(courseId);
    const completedCount = course.lessons.filter((l) => l.isCompleted).length;

    return {
      courseId:   course.id.value,
      courseTitle: course.title.value,
      totalLessons: course.lessons.length,
      completedLessons: completedCount,
      progressPercent:
        course.lessons.length > 0
          ? Math.round((completedCount / course.lessons.length) * 100)
          : 0,
      eligibleForCertificate: course.isEligibleForCertificate(),
      lessons: course.lessons.map((l) => ({
        lessonId:    l.id.value,
        title:       l.title,
        order:       l.order,
        isCompleted: l.isCompleted,
        lastScore:   l.lastScore.value,
      })),
    };
  }
}
