import { NotificationApplicationModule } from '@application/notification/notification.application.module';
import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { AdminNotificationController } from './admin-notification.controller';

@Module({
  imports: [NotificationApplicationModule],
  controllers: [NotificationController, AdminNotificationController],
})
export class NotificationWebModule {}
