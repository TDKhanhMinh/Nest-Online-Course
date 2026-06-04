import api from "@/lib/axios";
import {
  NotificationListResponseDto,
  RegisterFcmTokenDto,
  NotificationDto,
  AdminSendNotificationDto,
  AdminNotificationCampaignDto,
  AdminCampaignListResponseDto,
} from "../types";

export const notificationApi = {
  getNotifications: async (params: { page: number; limit: number }): Promise<NotificationListResponseDto> => {
    const response = await api.get<NotificationListResponseDto>("/notifications", { params });
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>("/notifications/unread-count");
    return response.data.count;
  },

  markAsRead: async (id: string): Promise<NotificationDto> => {
    const response = await api.patch<NotificationDto>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    const response = await api.patch<void>("/notifications/read-all");
    return response.data;
  },

  deleteNotification: async (id: string): Promise<void> => {
    const response = await api.delete<void>(`/notifications/${id}`);
    return response.data;
  },

  registerFcmToken: async (dto: RegisterFcmTokenDto): Promise<void> => {
    const response = await api.post<void>("/notifications/fcm-token", dto);
    return response.data;
  },

  unregisterFcmToken: async (fcmToken: string): Promise<void> => {
    const response = await api.delete<void>("/notifications/fcm-token", { params: { fcmToken } });
    return response.data;
  },

  adminSendNotification: async (dto: AdminSendNotificationDto): Promise<AdminNotificationCampaignDto> => {
    const response = await api.post<AdminNotificationCampaignDto>("/admin/notifications", dto);
    return response.data;
  },

  adminGetCampaigns: async (params: {
    page: number;
    limit: number;
    keyword?: string;
    targetType?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<AdminCampaignListResponseDto> => {
    const response = await api.get<AdminCampaignListResponseDto>("/admin/notifications", { params });
    return response.data;
  },

  adminGetCampaignDetail: async (campaignId: string): Promise<AdminNotificationCampaignDto> => {
    const response = await api.get<AdminNotificationCampaignDto>(`/admin/notifications/${campaignId}`);
    return response.data;
  },
};

