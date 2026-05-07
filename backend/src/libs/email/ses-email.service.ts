import { Injectable, Logger } from '@nestjs/common';
import { IEmailNotificationService } from '@shared/abstractions/services/i-email-notification.service';

/**
 * AWS SES adapter implementing IEmailNotificationService.
 * Replace method bodies with actual SES SDK calls in production.
 */
@Injectable()
export class SesEmailNotificationAdapter implements IEmailNotificationService {
  private readonly logger = new Logger(SesEmailNotificationAdapter.name);

  async sendEnrollmentConfirmation(to: string, courseName: string): Promise<void> {
    this.logger.log(`[SES] Sending enrollment confirmation to ${to} for "${courseName}"`);
    // TODO: ses.sendEmail({ ... })
  }

  async sendCertificateReady(to: string, courseName: string, certificateUrl: string): Promise<void> {
    this.logger.log(`[SES] Sending certificate ready to ${to} for "${courseName}": ${certificateUrl}`);
    // TODO: ses.sendEmail({ ... })
  }
}



