import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CertificateService } from '@/api/certificate/certificate.service';

/**
 * Scheduler tự động cấp chứng chỉ mỗi giờ.
 * Chỉ gọi Service để không có business logic ở đây.
 */
@Injectable()
export class AutoIssueCertificateTask {
  private readonly logger = new Logger(AutoIssueCertificateTask.name);

  constructor(private readonly certificateService: CertificateService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron(): Promise<void> {
    this.logger.log('Running auto-issue certificate job...');
    await this.certificateService.executeForPendingStudents();
  }
}
