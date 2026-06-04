import { Notification } from '@domain/notification/entities/notification.entity';
import { NotificationDocument } from '@/database/schemas/notification.schema';
import { UniqueId } from '@shared/types/unique-id.vo';

export class NotificationMapper {
  static toDomain(document: NotificationDocument): Notification {
    if (!document) return null;

    const payloadObj = document.payload instanceof Map
      ? Object.fromEntries(document.payload)
      : document.payload;

    return Notification.reconstitute(
      {
        recipientId: new UniqueId(document.recipientId.toString()),
        title: document.title,
        content: document.content,
        type: document.type,
        isRead: document.isRead,
        readAt: document.readAt,
        payload: payloadObj,
        actionUrl: document.actionUrl,
        targetType: document.targetType,
        targetId: document.targetId,
        priority: document.priority,
        dedupeKey: document.dedupeKey,
        deletedAt: document.deletedAt,
        campaignId: document.campaignId ? new UniqueId(document.campaignId.toString()) : undefined,
        senderId: document.senderId ? new UniqueId(document.senderId.toString()) : undefined,
        source: document.source,
        createdAt: (document as any).createdAt,
        updatedAt: (document as any).updatedAt,
      },
      new UniqueId(document._id.toString()),
    );
  }

  static toPersistence(domain: Notification): any {
    if (!domain) return null;
    return {
      _id: domain.id.value,
      recipientId: domain.recipientId.value,
      title: domain.title,
      content: domain.content,
      type: domain.type,
      isRead: domain.isRead,
      readAt: domain.readAt,
      payload: domain.payload ? new Map(Object.entries(domain.payload)) : undefined,
      actionUrl: domain.actionUrl,
      targetType: domain.targetType,
      targetId: domain.targetId,
      priority: domain.priority,
      dedupeKey: domain.dedupeKey,
      deletedAt: domain.deletedAt,
      campaignId: domain.campaignId?.value,
      senderId: domain.senderId?.value,
      source: domain.source,
    };
  }
}
