import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ICourseRepository, COURSE_REPOSITORY } from '@/common/abstractions/course.repository.interface';
import { IEnrollmentRepository, ENROLLMENT_REPOSITORY } from '@/common/abstractions/enrollment.repository.interface';
import { UniqueId } from '@/common/types/unique-id.vo';
import { QuizScore } from '@/api/course/value-objects/quiz-score.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';

export class CompleteLessonCommand {
  courseId: string;
  lessonId: string;
  studentId: string;
  score: number;
}

export class CompleteLessonResult {
  courseId: string;
  lessonId: string;
  allCompleted: boolean;
  eligibleForCertificate: boolean;
}

export class GetCourseProgressQuery {
  courseId: string;
  studentId: string;
}

export class GetCourseProgressResult {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  eligibleForCertificate: boolean;
  lessons: Array<{
    lessonId: string;
    title: string;
    order: number;
    isCompleted: boolean;
    lastScore: number;
  }>;
}

@Injectable()
export class CourseService {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,

    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async completeLesson(cmd: CompleteLessonCommand): Promise<CompleteLessonResult> {
    const courseId  = new UniqueId(cmd.courseId);
    const lessonId  = new UniqueId(cmd.lessonId);
    const studentId = new UniqueId(cmd.studentId);
    const score     = new QuizScore(cmd.score);

    const enrollment = await this.enrollmentRepo.findByStudentAndCourse(studentId, courseId);
    if (!enrollment?.isActive()) {
      throw new DomainException(ErrorCode.NOT_ENROLLED, `Student "${cmd.studentId}" is not enrolled in course "${cmd.courseId}"`);
    }

    const course = await this.courseRepo.findByIdOrThrow(courseId);
    course.completeLesson(lessonId, studentId, score);

    await this.courseRepo.save(course);

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

  async getCourseProgress(query: GetCourseProgressQuery): Promise<GetCourseProgressResult> {
    const courseId  = new UniqueId(query.courseId);
    const studentId = new UniqueId(query.studentId);

    const enrollment = await this.enrollmentRepo.findByStudentAndCourse(studentId, courseId);
    if (!enrollment?.isActive()) {
      throw new DomainException(ErrorCode.NOT_ENROLLED, `Student "${query.studentId}" is not enrolled in course "${query.courseId}"`);
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

  async getAllWithOffset(pageOptionsDto: import('@/common/pagination/offset/page-options.dto').PageOptionsDto) {
    return this.courseRepo.findAllWithOffset(pageOptionsDto);
  }

  async getAllWithCursor(cursorOptionsDto: import('@/common/pagination/cursor/cursor-options.dto').CursorOptionsDto) {
    return this.courseRepo.findAllWithCursor(cursorOptionsDto);
  }
}
