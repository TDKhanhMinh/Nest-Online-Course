import { Inject, Injectable, Logger } from '@nestjs/common';
import { INotificationRepository, INOTIFICATION_REPOSITORY } from '@domain/notification/ports/i-notification.repository';
import { INotificationDeviceRepository, INOTIFICATION_DEVICE_REPOSITORY } from '@domain/notification/ports/i-notification-device.repository';
import { IUserRepository, IUSER_REPOSITORY } from '@domain/user/ports/i-user.repository';
import { IPushNotificationService, IPUSH_NOTIFICATION_SERVICE } from '@domain/notification/ports/i-push-notification.service';
import { Notification } from '@domain/notification/entities/notification.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { NotificationType, NotificationPriority } from '@domain/notification/types/notification.types';

export interface AdminSendNotificationInput {
  senderId: string;
  senderEmail?: string;
  targetType: 'ALL' | 'USER';
  recipientId?: string;
  title: string;
  content: string;
  actionUrl?: string;
  priority?: NotificationPriority;
  requestId: string;
}

@Injectable()
export class AdminSendNotificationUseCase {
  private readonly logger = new Logger(AdminSendNotificationUseCase.name);

  constructor(
    @Inject(INOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
    @Inject(INOTIFICATION_DEVICE_REPOSITORY)
    private readonly deviceRepo: INotificationDeviceRepository,
    @Inject(IUSER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(IPUSH_NOTIFICATION_SERVICE)
    private readonly pushNotificationService: IPushNotificationService,
  ) {}

  async execute(input: AdminSendNotificationInput): Promise<any> {
    // 1. Idempotency Check: Save or verify campaign creation
    let campaign: any;
    try {
      campaign = await this.notificationRepo.saveCampaign({
        senderId: input.senderId,
        senderEmail: input.senderEmail,
        targetType: input.targetType,
        recipientId: input.recipientId,
        title: input.title,
        content: input.content,
        actionUrl: input.actionUrl,
        priority: input.priority ?? NotificationPriority.NORMAL,
        status: 'PROCESSING',
        requestId: input.requestId,
      });
    } catch (error: any) {
      if (error?.code === 11000 || error?.message?.includes('duplicate key')) {
        this.logger.log(`Duplicate request detected for requestId: ${input.requestId}. Returning existing campaign.`);
        // Search for the existing campaign by requestId
        const existing = await this.notificationRepo.findCampaigns(1, 0, { keyword: input.requestId });
        if (existing.campaigns && existing.campaigns.length > 0) {
          return existing.campaigns[0];
        }
      }
      throw error;
    }

    const campaignId = campaign._id.toString();

    let totalRecipients = 0;
    let totalTokens = 0;
    let inAppCreatedCount = 0;
    let pushSuccessCount = 0;
    let pushFailureCount = 0;

    try {
      if (input.targetType === 'USER') {
        // --- Single user flow ---
        const userId = input.recipientId;
        const user = await this.userRepo.findById(new UniqueId(userId));
        if (!user || !user.isActive) {
          throw new Error('Recipient does not exist or is inactive.');
        }

        totalRecipients = 1;

        // Create in-app notification
        const notification = Notification.create({
          recipientId: new UniqueId(userId),
          title: input.title,
          content: input.content,
          type: NotificationType.ADMIN_MANUAL,
          actionUrl: input.actionUrl,
          priority: input.priority ?? NotificationPriority.NORMAL,
          campaignId: new UniqueId(campaignId),
          senderId: new UniqueId(input.senderId),
          source: 'ADMIN',
        });

        await this.notificationRepo.save(notification);
        inAppCreatedCount = 1;

        // Find active tokens for the user
        const tokens = await this.deviceRepo.findActiveTokensByUserId(new UniqueId(userId));
        totalTokens = tokens.length;

        if (tokens.length > 0) {
          const pushResult = await this.pushNotificationService.sendMulticast({
            tokens,
            title: input.title,
            body: input.content,
            type: NotificationType.ADMIN_MANUAL,
            actionUrl: input.actionUrl,
            data: {
              campaignId,
              senderId: input.senderId,
            },
          });
          pushSuccessCount = pushResult.successCount;
          pushFailureCount = pushResult.failureCount;
        }

      } else {
        // --- Broadcast flow: batching & concurrency control ---
        const batchSize = 500;
        let lastId: string | undefined = undefined;
        let hasMore = true;

        while (hasMore) {
          const userIds = await this.userRepo.findActiveStudentUserIdsBatch(batchSize, lastId);
          if (userIds.length === 0) {
            hasMore = false;
            break;
          }

          totalRecipients += userIds.length;

          // 1. Create domain notifications for this batch
          const notifications = userIds.map((uId) =>
            Notification.create({
              recipientId: new UniqueId(uId),
              title: input.title,
              content: input.content,
              type: NotificationType.ADMIN_MANUAL,
              actionUrl: input.actionUrl,
              priority: input.priority ?? NotificationPriority.NORMAL,
              campaignId: new UniqueId(campaignId),
              senderId: new UniqueId(input.senderId),
              source: 'ADMIN',
            })
          );

          // Bulk write to DB
          await this.notificationRepo.bulkSaveNotifications(notifications);
          inAppCreatedCount += userIds.length;

          // 2. Fetch active FCM tokens for this batch of users
          const userTokenPairs = await this.deviceRepo.findActiveTokensByUserIds(userIds);
          const activeTokens = userTokenPairs.map((pair) => pair.token);
          totalTokens += activeTokens.length;

          if (activeTokens.length > 0) {
            const pushResult = await this.pushNotificationService.sendMulticast({
              tokens: activeTokens,
              title: input.title,
              body: input.content,
              type: NotificationType.ADMIN_MANUAL,
              actionUrl: input.actionUrl,
              data: {
                campaignId,
                senderId: input.senderId,
              },
            });
            pushSuccessCount += pushResult.successCount;
            pushFailureCount += pushResult.failureCount;
          }

          lastId = userIds[userIds.length - 1];
          if (userIds.length < batchSize) {
            hasMore = false;
          }
        }
      }

      // Update campaign success status
      campaign.totalRecipients = totalRecipients;
      campaign.totalTokens = totalTokens;
      campaign.inAppCreatedCount = inAppCreatedCount;
      campaign.pushSuccessCount = pushSuccessCount;
      campaign.pushFailureCount = pushFailureCount;
      campaign.status = pushFailureCount > 0 ? 'PARTIAL_FAILED' : 'COMPLETED';
      campaign.completedAt = new Date();

      await this.notificationRepo.saveCampaign(campaign);

    } catch (err: any) {
      this.logger.error(`Failed to process campaign ${campaignId}`, err);
      campaign.status = 'FAILED';
      campaign.errorSummary = err.message || String(err);
      campaign.completedAt = new Date();
      await this.notificationRepo.saveCampaign(campaign);
      throw err;
    }

    return campaign;
  }
}
