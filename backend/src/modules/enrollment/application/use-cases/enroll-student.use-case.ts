import { Injectable, Inject } from '@nestjs/common';
import { IEnrollmentRepository, ENROLLMENT_REPOSITORY } from '../../domain/ports/enrollment.repository.interface';
import { ICourseRepository, COURSE_REPOSITORY } from '@/modules/course/domain/ports/course.repository.interface';
import { IEmailNotificationService, EMAIL_NOTIFICATION_SERVICE } from '../ports/email-notification.service.interface';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { AlreadyEnrolledException } from '../../domain/exceptions/already-enrolled.exception';
import { EnrollStudentCommand } from './enroll-student.command';
import { EnrollStudentResult } from './enroll-student.result';

@Injectable()
export class EnrollStudentUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,

    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,

    @Inject(EMAIL_NOTIFICATION_SERVICE)
    private readonly emailService: IEmailNotificationService,
  ) {}

  async execute(cmd: EnrollStudentCommand): Promise<EnrollStudentResult> {
    const studentId = new UniqueId(cmd.studentId);
    const courseId  = new UniqueId(cmd.courseId);

    // Invariant: không được enroll trùng
    const existing = await this.enrollmentRepo.findByStudentAndCourse(studentId, courseId);
    if (existing) throw new AlreadyEnrolledException(cmd.studentId, cmd.courseId);

    // Kiểm tra course tồn tại
    const course = await this.courseRepo.findByIdOrThrow(courseId);

    const enrollment = Enrollment.create(studentId, courseId);
    await this.enrollmentRepo.save(enrollment);

    // Gửi email qua port (không biết SES hay SendGrid)
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
