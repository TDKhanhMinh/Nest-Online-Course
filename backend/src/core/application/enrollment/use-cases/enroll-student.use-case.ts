import { Inject, Injectable } from '@nestjs/common';
import { IEnrollmentRepository, IENROLLMENT_REPOSITORY } from '@domain/enrollment/ports/i-enrollment.repository';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { IEmailNotificationService, IEMAIL_NOTIFICATION_SERVICE } from '@shared/abstractions/services/i-email-notification.service';
import { Enrollment } from '@domain/enrollment/entities/enrollment.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';

export interface EnrollStudentCommand {
  studentId: string;
  courseId: string;
  studentEmail: string;
}

export interface EnrollStudentResult {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  status: string;
  enrolledAt: Date;
}

@Injectable()
export class EnrollStudentUseCase {
  constructor(
    @Inject(IENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,

    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,

    @Inject(IEMAIL_NOTIFICATION_SERVICE)
    private readonly emailService: IEmailNotificationService,
  ) {}

  async execute(cmd: EnrollStudentCommand): Promise<EnrollStudentResult> {
    const studentId = new UniqueId(cmd.studentId);
    const courseId  = new UniqueId(cmd.courseId);

    const existing = await this.enrollmentRepo.findByStudentAndCourse(studentId, courseId);
    if (existing) {
      throw new DomainException(
        ErrorCode.ALREADY_ENROLLED,
        `Student "${cmd.studentId}" is already enrolled in course "${cmd.courseId}"`
      );
    }

    const course = await this.courseRepo.findByIdOrThrow(courseId);

    const enrollment = Enrollment.create(studentId, courseId);
    await this.enrollmentRepo.save(enrollment);

    await this.emailService.sendEnrollmentConfirmation(cmd.studentEmail, course.title.value);

    return {
      enrollmentId: enrollment.id.value,
      studentId:    cmd.studentId,
      courseId:     cmd.courseId,
      status:       enrollment.status.value,
      enrolledAt:   enrollment.enrolledAt,
    };
  }
}
