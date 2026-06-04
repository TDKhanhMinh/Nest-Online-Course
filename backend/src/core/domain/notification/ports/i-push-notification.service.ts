import { UniqueId } from '@shared/types/unique-id.vo';
import { NotificationType } from '../types/notification.types';

export interface PushNotificationPayload {
  userId: UniqueId;
  title: string;
  body: string;
  notificationId: UniqueId;
  type: NotificationType;
  actionUrl?: string;
  data?: Record<string, string>;
}

export interface MulticastPushNotificationPayload {
  tokens: string[];
  title: string;
  body: string;
  type: string;
  actionUrl?: string;
  data?: Record<string, string>;
}

export interface IPushNotificationService {
  sendToUser(payload: PushNotificationPayload): Promise<void>;
  sendMulticast(payload: MulticastPushNotificationPayload): Promise<{ successCount: number; failureCount: number }>;
}

export const IPUSH_NOTIFICATION_SERVICE = Symbol('IPushNotificationService');

