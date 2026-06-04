"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  Bell,
  BellOff,
  Check,
  Trash2,
  ShoppingBag,
  Award,
  Trophy,
  Info,
  ChevronLeft,
  ChevronRight,
  Settings,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  useNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "../hooks/use-notifications";
import { useFcmNotification } from "../hooks/use-fcm-notification";
import { formatDateTime } from "@/lib/format-datetime";
import { NotificationDto, NotificationType } from "../../types";

export function NotificationListView() {
  const t = useTranslations("Notifications");
  const router = useRouter();
  
  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const limit = 10;

  // Queries & Mutations
  const { data, isLoading, isError, refetch } = useNotificationsQuery(page, limit);
  const { mutate: markAsRead } = useMarkAsReadMutation();
  const { mutate: markAllAsRead } = useMarkAllAsReadMutation();
  const { mutate: deleteNotification } = useDeleteNotificationMutation();

  // FCM Hook
  const { isTokenSynced, registerToken, unregisterToken, loading: fcmLoading } = useFcmNotification();

  const rawItems = data?.items || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  // Filter items in memory for instant feedback
  const items = unreadOnly ? rawItems.filter((item) => !item.isRead) : rawItems;

  const handleNotificationClick = (item: NotificationDto) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
    if (item.actionUrl) {
      router.push(item.actionUrl);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER_SUCCESS:
        return (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <ShoppingBag className="h-6 w-6" />
          </div>
        );
      case NotificationType.QUIZ_PASSED:
        return (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <Trophy className="h-6 w-6" />
          </div>
        );
      case NotificationType.CERTIFICATE_ISSUED:
        return (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <Award className="h-6 w-6" />
          </div>
        );
      default:
        return (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-500/10 text-slate-500">
            <Info className="h-6 w-6" />
          </div>
        );
    }
  };

  const getBadgeLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER_SUCCESS:
        return t("order_success");
      case NotificationType.QUIZ_PASSED:
        return t("quiz_passed");
      case NotificationType.CERTIFICATE_ISSUED:
        return t("certificate_issued");
      default:
        return t("system");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard" className="hover:text-brand-amber transition-colors no-underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">{t("title")}</span>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your alerts, reminders, and course updates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left column: Controls (Sidebar) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Filters Card */}
          <Card className="border border-brand-border bg-brand-bg2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-brand-amber" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={!unreadOnly ? "default" : "ghost"}
                onClick={() => setUnreadOnly(false)}
                className={`w-full justify-start font-semibold text-xs h-10 ${
                  !unreadOnly ? "bg-brand-amber text-black hover:bg-brand-amber2" : "text-slate-600 hover:text-brand-amber"
                }`}
              >
                {t("all")}
              </Button>
              <Button
                variant={unreadOnly ? "default" : "ghost"}
                onClick={() => setUnreadOnly(true)}
                className={`w-full justify-start font-semibold text-xs h-10 ${
                  unreadOnly ? "bg-brand-amber text-black hover:bg-brand-amber2" : "text-slate-600 hover:text-brand-amber"
                }`}
              >
                {t("unread_only")}
              </Button>
            </CardContent>
          </Card>

          {/* Device settings (FCM push toggle) */}
          <Card className="border border-brand-border bg-brand-bg2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Settings className="h-4 w-4 text-brand-amber" />
                Settings
              </CardTitle>
              <CardDescription className="text-[11px] leading-tight">
                {t("push_toggle_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("push_toggle")}
              </span>
              <Switch
                checked={isTokenSynced}
                disabled={fcmLoading}
                onCheckedChange={(checked) => (checked ? registerToken() : unregisterToken())}
                className="data-[state=checked]:bg-brand-amber"
              />
            </CardContent>
          </Card>

          {/* Bulk actions */}
          {totalItems > 0 && (
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => markAllAsRead()}
                className="w-full text-xs font-semibold h-11 border-brand-border text-slate-700 hover:text-brand-amber hover:border-brand-amber bg-brand-bg2"
              >
                <Check className="mr-2 h-4 w-4" />
                {t("mark_all_read")}
              </Button>
            </div>
          )}
        </div>

        {/* Right column: Main notifications lists */}
        <div className="lg:col-span-3">
          <Card className="border border-brand-border bg-brand-bg2 overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="divide-y divide-brand-border">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-6">
                      <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                      <div className="space-y-3 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-3 w-1/6" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-slate-500 mb-4">{t("error_loading")}</p>
                  <Button variant="outline" onClick={() => refetch()}>
                    {t("retry")}
                  </Button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-bg3 mb-4 text-slate-400">
                    <BellOff className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {t("empty")}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm">
                    {t("empty_desc")}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-brand-border">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`flex items-start gap-4 p-6 transition-colors relative group cursor-pointer ${
                        item.isRead 
                          ? "hover:bg-brand-bg3/40" 
                          : "bg-brand-amber/5 hover:bg-brand-amber/10"
                      }`}
                    >
                      {getNotificationIcon(item.type)}
                      <div className="flex-1 min-w-0 pr-12">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <Badge variant="outline" className="text-xs font-semibold py-0.5 px-2">
                            {getBadgeLabel(item.type)}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {formatDateTime(item.createdAt)}
                          </span>
                        </div>
                        <h3 className={`text-sm sm:text-base font-bold leading-snug text-slate-900 dark:text-white ${
                          item.isRead ? "" : "text-brand-amber"
                        }`}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-3xl">
                          {item.content}
                        </p>
                      </div>

                      {/* Read status dot */}
                      {!item.isRead && (
                        <span className="absolute top-6 right-6 h-3 w-3 rounded-full bg-brand-amber shrink-0" />
                      )}

                      {/* Hover action bar (visible on hover or always on touch devices) */}
                      <div className="flex items-center gap-1.5 absolute right-4 bottom-4 md:right-6 md:top-1/2 md:-translate-y-1/2 md:bottom-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-brand-bg/95 md:bg-transparent rounded-lg p-1.5 md:p-0 shadow md:shadow-none border md:border-none border-brand-border">
                        {!item.isRead && (
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={t("mark_read")}
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(item.id);
                            }}
                            className="h-11 w-11 md:h-10 md:w-10 text-slate-500 hover:text-brand-amber rounded-full hover:bg-brand-bg3 focus-visible:ring-2"
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={t("delete")}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(item.id);
                          }}
                          className="h-11 w-11 md:h-10 md:w-10 text-slate-500 hover:text-red-500 rounded-full hover:bg-red-500/10 focus-visible:ring-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination controls */}
          {!isLoading && !isError && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-brand-bg2 border border-brand-border p-4 rounded-xl">
              <span className="text-xs sm:text-sm text-slate-500">
                Page <span className="font-semibold text-slate-900 dark:text-white">{page}</span> of{" "}
                <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-9 w-9 p-0 flex items-center justify-center border-brand-border bg-brand-bg hover:text-brand-amber disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-9 w-9 p-0 flex items-center justify-center border-brand-border bg-brand-bg hover:text-brand-amber disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Stacked columns layout. Settings and filters sit on top. Items are full-width with touch target buttons.
// tablet  (md / lg):       Grid filters stack above or align as row, items have wide actions display.
// desktop (xl / 2xl):      Left 1/4 sidebar for filters/settings, right 3/4 lists block. Custom pagination component.
// Interaction:             Buttons have min-h-[44px], nice shadow feedback on click, outline rings preserved.
