import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LessonCompletedEvent } from '../../domain/events/lesson-completed.event';
import { ICourseRepository, COURSE_REPOSITORY } from '../../domain/ports/course.repository.interface';
import { IssueCertificateUseCase } from '@/modules/certificate/application/use-cases/issue-certificate/issue-certificate.use-case';

@Injectable()
export class OnLessonCompletedHandler {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    private readonly issueCertUseCase: IssueCertificateUseCase,
  ) {}

  @OnEvent(LessonCompletedEvent.name, { async: true })
  async handle(event: LessonCompletedEvent): Promise<void> {
    const course = await this.courseRepo.findById(event.courseId);
    if (!course) return;

    if (course.isEligibleForCertificate()) {
      await this.issueCertUseCase.execute({
        studentId: event.studentId.value,
        courseId:  event.courseId.value,
      });
    }
  }
}
