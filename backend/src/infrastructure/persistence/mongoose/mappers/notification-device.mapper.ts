import { NotificationDevice } from '@domain/notification/entities/notification-device.entity';
import { NotificationDeviceDocument } from '@/database/schemas/notification-device.schema';
import { UniqueId } from '@shared/types/unique-id.vo';

export class NotificationDeviceMapper {
  static toDomain(document: NotificationDeviceDocument): NotificationDevice {
    if (!document) return null;
    return NotificationDevice.reconstitute(
      {
        userId: new UniqueId(document.userId.toString()),
        fcmToken: document.fcmToken,
        deviceId: document.deviceId,
        userAgent: document.userAgent,
        platform: document.platform as any,
        isActive: document.isActive,
        lastUsedAt: document.lastUsedAt,
        createdAt: (document as any).createdAt,
        updatedAt: (document as any).updatedAt,
      },
      new UniqueId(document._id.toString()),
    );
  }

  static toPersistence(domain: NotificationDevice): any {
    if (!domain) return null;
    return {
      _id: domain.id.value,
      userId: domain.userId.value,
      fcmToken: domain.fcmToken,
      deviceId: domain.deviceId,
      userAgent: domain.userAgent,
      platform: domain.platform,
      isActive: domain.isActive,
      lastUsedAt: domain.lastUsedAt,
    };
  }
}
