import { Injectable, Inject } from '@nestjs/common';
import { IEnrollmentRepository, ENROLLMENT_REPOSITORY } from '@/common/abstractions/enrollment.repository.interface';
import { ICourseRepository, COURSE_REPOSITORY } from '@/common/abstractions/course.repository.interface';
import { IEmailNotificationService, EMAIL_NOTIFICATION_SERVICE } from '@/common/abstractions/email-notification.service.interface';
import { Enrollment } from '@/api/enrollment/entities/enrollment.entity';
import { UniqueId } from '@/common/types/unique-id.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';

export class EnrollStudentCommand {
  studentId: string;
  courseId: string;
  studentEmail: string;
}

export class EnrollStudentResult {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  status: string;
  enrolledAt: Date;
}

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,

    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,

    @Inject(EMAIL_NOTIFICATION_SERVICE)
    private readonly emailService: IEmailNotificationService,
  ) {}

  async enrollStudent(cmd: EnrollStudentCommand): Promise<EnrollStudentResult> {
    const studentId = new UniqueId(cmd.studentId);
    const courseId  = new UniqueId(cmd.courseId);

    const existing = await this.enrollmentRepo.findByStudentAndCourse(studentId, courseId);
    if (existing) throw new DomainException(ErrorCode.ALREADY_ENROLLED, `Student "${cmd.studentId}" is already enrolled in course "${cmd.courseId}"`);

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
