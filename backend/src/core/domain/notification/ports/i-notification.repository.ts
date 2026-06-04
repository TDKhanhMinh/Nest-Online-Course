import { Notification } from '../entities/notification.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface INotificationRepository {
  findByIdAndRecipient(id: UniqueId, recipientId: UniqueId): Promise<Notification | null>;
  findByRecipient(recipientId: UniqueId, limit: number, offset: number): Promise<{ notifications: Notification[]; total: number }>;
  countUnread(recipientId: UniqueId): Promise<number>;
  save(notification: Notification): Promise<void>;
  markAllAsRead(recipientId: UniqueId): Promise<void>;
  softDeleteByRecipient(id: UniqueId, recipientId: UniqueId): Promise<void>;
  findByDedupeKey(dedupeKey: string): Promise<Notification | null>;

  // Campaign and bulk save methods
  saveCampaign(campaign: any): Promise<any>;
  findCampaignById(id: string): Promise<any>;
  findCampaigns(limit: number, offset: number, filter?: any): Promise<{ campaigns: any[]; total: number }>;
  bulkSaveNotifications(notifications: Notification[]): Promise<void>;
}

export const INOTIFICATION_REPOSITORY = Symbol('INotificationRepository');

