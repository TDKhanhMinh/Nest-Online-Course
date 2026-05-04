import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CertificateIssuedEvent } from '@/api/certificate/events/certificate-issued.event';
import { IEmailNotificationService, EMAIL_NOTIFICATION_SERVICE } from '@/common/abstractions/services/i-email-notification.service';
import { Inject } from '@nestjs/common';

@Injectable()
export class OnCertificateIssuedHandler {
  private readonly logger = new Logger(OnCertificateIssuedHandler.name);

  constructor(
    @Inject(EMAIL_NOTIFICATION_SERVICE)
    private readonly emailService: IEmailNotificationService,
  ) {}

  @OnEvent(CertificateIssuedEvent.name, { async: true })
  async handle(event: CertificateIssuedEvent): Promise<void> {
    this.logger.log(`Certificate issued for student ${event.studentId.value}`);

    // Notify student (email detail would come from a UserRepository in real app)
    await this.emailService.sendCertificateReady(
      `student-${event.studentId.value}@placeholder.com`,
      `Course ${event.courseId.value}`,
      event.certificateUrl,
    );
  }
}
