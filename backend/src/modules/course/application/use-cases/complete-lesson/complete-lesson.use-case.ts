import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ICourseRepository, COURSE_REPOSITORY } from '../../../domain/ports/course.repository.interface';
import { IEnrollmentRepository, ENROLLMENT_REPOSITORY } from '@/modules/enrollment/domain/ports/enrollment.repository.interface';
import { CompleteLessonCommand } from './complete-lesson.command';
import { CompleteLessonResult } from './complete-lesson.result';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { QuizScore } from '../../../domain/value-objects/quiz-score.vo';
import { NotEnrolledException } from '@/modules/enrollment/domain/exceptions/not-enrolled.exception';

@Injectable()
export class CompleteLessonUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,

    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(cmd: CompleteLessonCommand): Promise<CompleteLessonResult> {
    const courseId  = new UniqueId(cmd.courseId);
    const lessonId  = new UniqueId(cmd.lessonId);
    const studentId = new UniqueId(cmd.studentId);
    const score     = new QuizScore(cmd.score);

    // Kiểm tra invariant: học viên phải đã enroll (Application logic, không phải DB query thẳng)
    const enrollment = await this.enrollmentRepo.findByStudentAndCourse(studentId, courseId);
    if (!enrollment?.isActive()) {
      throw new NotEnrolledException(cmd.studentId, cmd.courseId);
    }

    // Lấy aggregate – business logic nằm trong entity
    const course = await this.courseRepo.findByIdOrThrow(courseId);
    course.completeLesson(lessonId, studentId, score);

    // Persist trước khi dispatch events
    await this.courseRepo.save(course);

    // Dispatch tất cả domain events đã tích lũy trong aggregate
    for (const event of course.domainEvents) {
      await this.eventEmitter.emitAsync(event.constructor.name, event);
    }
    course.clearDomainEvents();

    return {
      courseId: courseId.value,
      lessonId: lessonId.value,
      allCompleted: course.allLessonsCompleted(),
      eligibleForCertificate: course.isEligibleForCertificate(),
    };
  }
}
