import { Inject, Injectable, Logger } from '@nestjs/common';
import { INotificationRepository, INOTIFICATION_REPOSITORY } from '@domain/notification/ports/i-notification.repository';
import { IPushNotificationService, IPUSH_NOTIFICATION_SERVICE } from '@domain/notification/ports/i-push-notification.service';
import { Notification } from '@domain/notification/entities/notification.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { NotificationType, NotificationPriority, NotificationTargetType } from '@domain/notification/types/notification.types';

export interface CreateNotificationInput {
  recipientId: string;
  title: string;
  content: string;
  type: NotificationType;
  actionUrl?: string;
  targetType?: NotificationTargetType;
  targetId?: string;
  priority?: NotificationPriority;
  dedupeKey?: string;
  payload?: Record<string, any>;
}

@Injectable()
export class CreateNotificationUseCase {
  private readonly logger = new Logger(CreateNotificationUseCase.name);

  constructor(
    @Inject(INOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
    @Inject(IPUSH_NOTIFICATION_SERVICE)
    private readonly pushNotificationService: IPushNotificationService,
  ) {}

  async execute(input: CreateNotificationInput): Promise<Notification> {
    if (input.dedupeKey) {
      try {
        const existing = await this.notificationRepo.findByDedupeKey(input.dedupeKey);
        if (existing) {
          this.logger.log(`Notification with dedupeKey ${input.dedupeKey} already exists. Skipping creation.`);
          return existing;
        }
      } catch (error) {
        this.logger.error(`Error checking dedupeKey ${input.dedupeKey}`, error);
      }
    }

    const notification = Notification.create({
      recipientId: new UniqueId(input.recipientId),
      title: input.title,
      content: input.content,
      type: input.type,
      actionUrl: input.actionUrl,
      targetType: input.targetType,
      targetId: input.targetId,
      priority: input.priority ?? NotificationPriority.NORMAL,
      dedupeKey: input.dedupeKey,
      payload: input.payload,
    });

    try {
      await this.notificationRepo.save(notification);
    } catch (error: any) {
      if (error?.code === 11000 || error?.message?.includes('duplicate key')) {
        this.logger.log(`Duplicate key error for dedupeKey ${input.dedupeKey}. Retrieving existing notification.`);
        if (input.dedupeKey) {
          const existing = await this.notificationRepo.findByDedupeKey(input.dedupeKey);
          if (existing) return existing;
        }
      }
      throw error;
    }

    // Attempt pushing to FCM devices
    const flatData: Record<string, string> = {
      type: notification.type,
    };
    if (input.payload) {
      for (const [key, val] of Object.entries(input.payload)) {
        if (val !== undefined && val !== null) {
          flatData[key] = typeof val === 'object' ? JSON.stringify(val) : String(val);
        }
      }
    }

    this.pushNotificationService
      .sendToUser({
        userId: notification.recipientId,
        title: notification.title,
        body: notification.content,
        notificationId: notification.id,
        type: notification.type,
        actionUrl: notification.actionUrl,
        data: flatData,
      })
      .catch((err) => {
        this.logger.warn(
          `Failed to dispatch FCM push notification for notification ${notification.id.value}: ${err.message}`,
        );
      });

    return notification;
  }
}
