import { IsOptional, IsInt, Min, IsString, IsNotEmpty, IsEnum, ValidateIf, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import {
  NotificationType,
  NotificationPriority,
  NotificationTargetType,
} from '@domain/notification/types/notification.types';

export class GetNotificationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class NotificationResponseDto {
  id: string;
  recipientId: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  readAt?: string;
  payload?: Record<string, any>;
  actionUrl?: string;
  targetType?: NotificationTargetType;
  targetId?: string;
  priority: NotificationPriority;
  createdAt: string;
}

export class NotificationListResponseDto {
  items: NotificationResponseDto[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export class RegisterFcmTokenDto {
  @IsNotEmpty()
  @IsString()
  fcmToken: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  platform?: 'WEB' | 'ANDROID' | 'IOS';
}

export class UnregisterFcmTokenDto {
  @IsNotEmpty()
  @IsString()
  fcmToken: string;
}

export class AdminSendNotificationDto {
  @IsNotEmpty()
  @IsString()
  targetType: 'ALL' | 'USER';

  @ValidateIf((o) => o.targetType === 'USER')
  @IsNotEmpty()
  @IsString()
  recipientId?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  actionUrl?: string;

  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @IsNotEmpty()
  @IsString()
  requestId: string;
}

