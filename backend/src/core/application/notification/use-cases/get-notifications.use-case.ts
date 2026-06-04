import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository, INOTIFICATION_REPOSITORY } from '@domain/notification/ports/i-notification.repository';
import { GetNotificationsDto, NotificationListResponseDto } from '../dto/notification.dto';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class GetNotificationsUseCase {
  constructor(
    @Inject(INOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(recipientId: string, dto: GetNotificationsDto): Promise<NotificationListResponseDto> {
    const page = Math.max(1, dto.page ?? 1);
    const limit = Math.max(1, Math.min(100, dto.limit ?? 10));
    const offset = (page - 1) * limit;

    const recipientUniqueId = new UniqueId(recipientId);

    const [{ notifications, total }, unreadCount] = await Promise.all([
      this.notificationRepo.findByRecipient(recipientUniqueId, limit, offset),
      this.notificationRepo.countUnread(recipientUniqueId),
    ]);

    const items = notifications.map((n) => ({
      id: n.id.value,
      recipientId: n.recipientId.value,
      title: n.title,
      content: n.content,
      type: n.type,
      isRead: n.isRead,
      readAt: n.readAt ? n.readAt.toISOString() : undefined,
      payload: n.payload,
      actionUrl: n.actionUrl,
      targetType: n.targetType,
      targetId: n.targetId,
      priority: n.priority,
      createdAt: n.createdAt ? n.createdAt.toISOString() : new Date().toISOString(),
    }));

    const hasNextPage = offset + limit < total;

    return {
      items,
      total,
      unreadCount,
      page,
      limit,
      hasNextPage,
    };
  }
}
