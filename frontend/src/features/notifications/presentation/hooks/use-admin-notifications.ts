import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { notificationApi } from "../../api/notification.api";
import { AdminSendNotificationDto } from "../../types";
import { useMe } from "@/features/auth/presentation/hooks/use-auth-hooks";

export const useAdminCampaignsQuery = (params: {
  page: number;
  limit: number;
  keyword?: string;
  targetType?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  const { data: user } = useMe();
  return useQuery({
    queryKey: ["admin", "campaigns", params],
    queryFn: () => notificationApi.adminGetCampaigns(params),
    placeholderData: keepPreviousData,
    staleTime: 5000,
    enabled: !!user,
  });
};

export const useAdminCampaignDetailQuery = (campaignId: string, enabled: boolean = true) => {
  const { data: user } = useMe();
  return useQuery({
    queryKey: ["admin", "campaigns", "detail", campaignId],
    queryFn: () => notificationApi.adminGetCampaignDetail(campaignId),
    enabled: enabled && !!campaignId && !!user,
  });
};

export const useAdminSendNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AdminSendNotificationDto) => notificationApi.adminSendNotification(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "campaigns"] });
    },
  });
};
