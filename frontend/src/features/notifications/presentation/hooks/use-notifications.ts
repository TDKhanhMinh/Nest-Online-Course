import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../../api/notification.api";
import { useMe } from "@/features/auth/presentation/hooks/use-auth-hooks";

export const useNotificationsQuery = (page: number, limit: number) => {
  const { data: user } = useMe();
  return useQuery({
    queryKey: queryKeys.notifications.list({ page, limit }),
    queryFn: () => notificationApi.getNotifications({ page, limit }),
    enabled: !!user,
    staleTime: 30000, // 30 seconds
  });
};

export const useUnreadCountQuery = () => {
  const { data: user } = useMe();
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => notificationApi.getUnreadCount(),
    enabled: !!user,
    refetchInterval: 60000, // Short polling fallback 60 seconds
    staleTime: 10000, // 10 seconds
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onMutate: async (id) => {
      // Cancel outstanding queries so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      // Snapshot the previous values
      const previousUnread = queryClient.getQueryData<number>(queryKeys.notifications.unreadCount());
      const previousLists = queryClient.getQueriesData({ queryKey: queryKeys.notifications.lists() });

      // Optimistically decrement unreadCount
      if (previousUnread !== undefined && previousUnread > 0) {
        queryClient.setQueryData(queryKeys.notifications.unreadCount(), previousUnread - 1);
      }

      // Optimistically update lists
      queryClient.setQueriesData(
        { queryKey: queryKeys.notifications.lists() },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item: any) =>
              item.id === id ? { ...item, isRead: true } : item
            ),
            unreadCount: Math.max(0, (oldData.unreadCount || 0) - 1),
          };
        }
      );

      return { previousUnread, previousLists };
    },
    onError: (err, id, context) => {
      // Rollback if error
      if (context) {
        if (context.previousUnread !== undefined) {
          queryClient.setQueryData(queryKeys.notifications.unreadCount(), context.previousUnread);
        }
        context.previousLists.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: () => {
      // Refetch to sync state
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      const previousUnread = queryClient.getQueryData<number>(queryKeys.notifications.unreadCount());
      const previousLists = queryClient.getQueriesData({ queryKey: queryKeys.notifications.lists() });

      // Set unread count to 0
      queryClient.setQueryData(queryKeys.notifications.unreadCount(), 0);

      // Set isRead: true for all items
      queryClient.setQueriesData(
        { queryKey: queryKeys.notifications.lists() },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item: any) => ({ ...item, isRead: true })),
            unreadCount: 0,
          };
        }
      );

      return { previousUnread, previousLists };
    },
    onError: (err, variables, context) => {
      if (context) {
        if (context.previousUnread !== undefined) {
          queryClient.setQueryData(queryKeys.notifications.unreadCount(), context.previousUnread);
        }
        context.previousLists.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.deleteNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      const previousUnread = queryClient.getQueryData<number>(queryKeys.notifications.unreadCount());
      const previousLists = queryClient.getQueriesData({ queryKey: queryKeys.notifications.lists() });

      // Optimistically update lists by removing the item
      queryClient.setQueriesData(
        { queryKey: queryKeys.notifications.lists() },
        (oldData: any) => {
          if (!oldData) return oldData;
          
          const deletedItem = oldData.items.find((item: any) => item.id === id);
          const wasUnread = deletedItem ? !deletedItem.isRead : false;

          // If deleted item was unread, decrement unreadCount
          if (wasUnread && previousUnread !== undefined && previousUnread > 0) {
            queryClient.setQueryData(queryKeys.notifications.unreadCount(), previousUnread - 1);
          }

          return {
            ...oldData,
            items: oldData.items.filter((item: any) => item.id !== id),
            total: Math.max(0, (oldData.total || 0) - 1),
            unreadCount: wasUnread ? Math.max(0, (oldData.unreadCount || 0) - 1) : (oldData.unreadCount || 0),
          };
        }
      );

      return { previousUnread, previousLists };
    },
    onError: (err, id, context) => {
      if (context) {
        if (context.previousUnread !== undefined) {
          queryClient.setQueryData(queryKeys.notifications.unreadCount(), context.previousUnread);
        }
        context.previousLists.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};
