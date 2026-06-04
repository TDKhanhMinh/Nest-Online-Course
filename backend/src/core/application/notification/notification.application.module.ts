import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { CreateNotificationUseCase } from './use-cases/create-notification.use-case';
import { GetNotificationsUseCase } from './use-cases/get-notifications.use-case';
import { GetUnreadNotificationCountUseCase } from './use-cases/get-unread-count.use-case';
import { MarkNotificationAsReadUseCase } from './use-cases/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from './use-cases/mark-all-notifications-as-read.use-case';
import { SoftDeleteNotificationUseCase } from './use-cases/soft-delete-notification.use-case';
import { RegisterFcmTokenUseCase } from './use-cases/register-fcm-token.use-case';
import { UnregisterFcmTokenUseCase } from './use-cases/unregister-fcm-token.use-case';
import { AdminSendNotificationUseCase } from './use-cases/admin-send-notification.use-case';
import { GetAdminCampaignsUseCase } from './use-cases/get-admin-campaigns.use-case';
import { GetAdminCampaignDetailUseCase } from './use-cases/get-admin-campaign-detail.use-case';
import { NotificationEventHandlers } from './events/notification-event.handlers';

const useCases = [
  CreateNotificationUseCase,
  GetNotificationsUseCase,
  GetUnreadNotificationCountUseCase,
  MarkNotificationAsReadUseCase,
  MarkAllNotificationsAsReadUseCase,
  SoftDeleteNotificationUseCase,
  RegisterFcmTokenUseCase,
  UnregisterFcmTokenUseCase,
  AdminSendNotificationUseCase,
  GetAdminCampaignsUseCase,
  GetAdminCampaignDetailUseCase,
];

@Module({
  imports: [InfrastructureModule],
  providers: [
    ...useCases,
    NotificationEventHandlers,
  ],
  exports: [...useCases],
})
export class NotificationApplicationModule {}
