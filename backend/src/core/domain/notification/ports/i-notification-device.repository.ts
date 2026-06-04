import { NotificationDevice } from '../entities/notification-device.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface INotificationDeviceRepository {
  save(device: NotificationDevice): Promise<void>;
  findByFcmToken(fcmToken: string): Promise<NotificationDevice | null>;
  findActiveTokensByUserId(userId: UniqueId): Promise<string[]>;
  deactivateTokens(fcmTokens: string[]): Promise<void>;
  findByUserAndToken(userId: UniqueId, fcmToken: string): Promise<NotificationDevice | null>;
  findActiveTokensByUserIds(userIds: string[]): Promise<Array<{ userId: string; token: string }>>;
}

export const INOTIFICATION_DEVICE_REPOSITORY = Symbol('INotificationDeviceRepository');
