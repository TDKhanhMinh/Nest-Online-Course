export enum NotificationType {
  ORDER_SUCCESS = 'ORDER_SUCCESS',
  CERTIFICATE_ISSUED = 'CERTIFICATE_ISSUED',
  QUIZ_PASSED = 'QUIZ_PASSED',
  SYSTEM = 'SYSTEM',
  ADMIN_MANUAL = 'ADMIN_MANUAL',
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

export interface NotificationDto {
  id: string;
  recipientId: string;
  title: string;
  content: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  payload?: Record<string, any>;
  createdAt: string;
  readAt?: string;
}

export interface NotificationListResponseDto {
  items: NotificationDto[];
  total: number;
  unreadCount: number;
}

export interface RegisterFcmTokenDto {
  fcmToken: string;
  platform: 'WEB' | 'ANDROID' | 'IOS';
}

export interface AdminSendNotificationDto {
  targetType: 'ALL' | 'USER';
  recipientId?: string;
  title: string;
  content: string;
  actionUrl?: string;
  priority?: NotificationPriority;
  requestId: string;
}

export interface AdminNotificationCampaignDto {
  _id: string;
  senderId: string;
  senderEmail?: string;
  targetType: 'ALL' | 'USER';
  recipientId?: string;
  title: string;
  content: string;
  actionUrl?: string;
  priority: string;
  totalRecipients: number;
  totalTokens: number;
  inAppCreatedCount: number;
  pushSuccessCount: number;
  pushFailureCount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'PARTIAL_FAILED' | 'FAILED';
  errorSummary?: string;
  requestId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AdminCampaignListResponseDto {
  items: AdminNotificationCampaignDto[];
  total: number;
  page: number;
  limit: number;
}

