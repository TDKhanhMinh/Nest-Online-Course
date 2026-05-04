import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IssueCertificateUseCase } from '../../application/use-cases/issue-certificate/issue-certificate.use-case';

/**
 * Scheduler tự động cấp chứng chỉ mỗi giờ.
 * Chỉ gọi Use Case – không có business logic ở đây.
 */
@Injectable()
export class AutoIssueCertificateScheduler {
  private readonly logger = new Logger(AutoIssueCertificateScheduler.name);

  constructor(private readonly issueCertUseCase: IssueCertificateUseCase) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron(): Promise<void> {
    this.logger.log('Running auto-issue certificate job...');
    await this.issueCertUseCase.executeForPendingStudents();
  }
}
