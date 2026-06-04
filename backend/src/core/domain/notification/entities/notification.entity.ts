import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';
import {
  NotificationType,
  NotificationPriority,
  NotificationTargetType,
} from '../types/notification.types';

export interface NotificationProps {
  recipientId: UniqueId;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  readAt?: Date;
  payload?: Record<string, any>;
  actionUrl?: string;
  targetType?: NotificationTargetType;
  targetId?: string;
  priority: NotificationPriority;
  dedupeKey?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  campaignId?: UniqueId;
  senderId?: UniqueId;
  source?: string;
}

export class Notification extends AggregateRoot<NotificationProps> {
  get recipientId(): UniqueId {
    return this.props.recipientId;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get type(): NotificationType {
    return this.props.type;
  }

  get isRead(): boolean {
    return this.props.isRead;
  }

  get readAt(): Date | undefined {
    return this.props.readAt;
  }

  get payload(): Record<string, any> | undefined {
    return this.props.payload;
  }

  get actionUrl(): string | undefined {
    return this.props.actionUrl;
  }

  get targetType(): NotificationTargetType | undefined {
    return this.props.targetType;
  }

  get targetId(): string | undefined {
    return this.props.targetId;
  }

  get priority(): NotificationPriority {
    return this.props.priority;
  }

  get dedupeKey(): string | undefined {
    return this.props.dedupeKey;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get campaignId(): UniqueId | undefined {
    return this.props.campaignId;
  }

  get senderId(): UniqueId | undefined {
    return this.props.senderId;
  }

  get source(): string | undefined {
    return this.props.source;
  }

  markAsRead(): void {
    if (!this.props.isRead) {
      this.props.isRead = true;
      this.props.readAt = new Date();
    }
  }

  softDelete(): void {
    if (!this.props.deletedAt) {
      this.props.deletedAt = new Date();
    }
  }

  public static create(
    props: Omit<NotificationProps, 'isRead' | 'priority'> & {
      isRead?: boolean;
      priority?: NotificationPriority;
    },
    id?: UniqueId,
  ): Notification {
    return new Notification(
      {
        ...props,
        isRead: props.isRead ?? false,
        priority: props.priority ?? NotificationPriority.NORMAL,
      },
      id ?? UniqueId.generate(),
    );
  }

  public static reconstitute(props: NotificationProps, id: UniqueId): Notification {
    return new Notification(props, id);
  }
}
