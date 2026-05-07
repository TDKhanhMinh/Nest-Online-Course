import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailNotificationService } from '@shared/abstractions/services/i-email-notification.service';

@Injectable()
export class NodemailerAdapter implements IEmailNotificationService {
  private readonly logger = new Logger(NodemailerAdapter.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendEnrollmentConfirmation(to: string, courseName: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM', '"Online Course" <noreply@example.com>'),
        to,
        subject: `Enrollment Confirmation: ${courseName}`,
        html: `
          <h1>Congratulations!</h1>
          <p>You have successfully enrolled in the course: <strong>${courseName}</strong>.</p>
          <p>Happy learning!</p>
        `,
      });
      this.logger.log(`Enrollment confirmation email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send enrollment confirmation email: ${error.message}`, error.stack);
    }
  }

  async sendCertificateReady(to: string, courseName: string, certificateUrl: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM', '"Online Course" <noreply@example.com>'),
        to,
        subject: `Certificate Ready: ${courseName}`,
        html: `
          <h1>Great Job!</h1>
          <p>You have completed the course: <strong>${courseName}</strong>.</p>
          <p>Your certificate is ready. You can download it here: <a href="${certificateUrl}">${certificateUrl}</a></p>
        `,
      });
      this.logger.log(`Certificate ready email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send certificate ready email: ${error.message}`, error.stack);
    }
  }
}
