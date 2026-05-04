import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LessonCompletedEvent } from '@/api/course/events/lesson-completed.event';
import { ICourseRepository, COURSE_REPOSITORY } from '@/common/abstractions/course.repository.interface';
import { CertificateService } from '@/api/certificate/certificate.service';

@Injectable()
export class OnLessonCompletedHandler {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    private readonly certificateService: CertificateService,
  ) {}

  @OnEvent(LessonCompletedEvent.name, { async: true })
  async handle(event: LessonCompletedEvent): Promise<void> {
    const course = await this.courseRepo.findById(event.courseId);
    if (!course) return;

    if (course.isEligibleForCertificate()) {
      await this.certificateService.issueCertificate({
        studentId: event.studentId.value,
        courseId:  event.courseId.value,
      });
    }
  }
}
