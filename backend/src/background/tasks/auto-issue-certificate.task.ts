import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Scheduler tự động cấp chứng chỉ mỗi giờ.
 * Chỉ gọi Service để không có business logic ở đây.
 */
@Injectable()
export class AutoIssueCertificateTask {
  private readonly logger = new Logger(AutoIssueCertificateTask.name);

  constructor() {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron(): Promise<void> {
    this.logger.log('Running auto-issue certificate job...');
    // TODO: Implement AutoIssueCertificateUseCase to replace executeForPendingStudents
    // await this.autoIssueCertificateUseCase.execute();
  }
}



