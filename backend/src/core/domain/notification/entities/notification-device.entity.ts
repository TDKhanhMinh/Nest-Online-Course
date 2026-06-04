import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface NotificationDeviceProps {
  userId: UniqueId;
  fcmToken: string;
  deviceId?: string;
  userAgent?: string;
  platform: 'WEB' | 'ANDROID' | 'IOS';
  isActive: boolean;
  lastUsedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NotificationDevice extends AggregateRoot<NotificationDeviceProps> {
  get userId(): UniqueId {
    return this.props.userId;
  }

  get fcmToken(): string {
    return this.props.fcmToken;
  }

  get deviceId(): string | undefined {
    return this.props.deviceId;
  }

  get userAgent(): string | undefined {
    return this.props.userAgent;
  }

  get platform(): 'WEB' | 'ANDROID' | 'IOS' {
    return this.props.platform;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get lastUsedAt(): Date | undefined {
    return this.props.lastUsedAt;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  activate(): void {
    this.props.isActive = true;
    this.props.lastUsedAt = new Date();
  }

  public static create(
    props: Omit<NotificationDeviceProps, 'isActive'> & {
      isActive?: boolean;
    },
    id?: UniqueId,
  ): NotificationDevice {
    return new NotificationDevice(
      {
        ...props,
        isActive: props.isActive ?? true,
        lastUsedAt: props.lastUsedAt ?? new Date(),
      },
      id ?? UniqueId.generate(),
    );
  }

  public static reconstitute(props: NotificationDeviceProps, id: UniqueId): NotificationDevice {
    return new NotificationDevice(props, id);
  }
}
