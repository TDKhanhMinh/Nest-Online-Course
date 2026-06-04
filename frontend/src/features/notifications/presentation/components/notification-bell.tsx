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
  ExternalLink 
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import {
  useNotificationsQuery,
  useUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "../hooks/use-notifications";
import { useFcmNotification } from "../hooks/use-fcm-notification";
import { formatDateTime } from "@/lib/format-datetime";
import { NotificationDto, NotificationType } from "../../types";

export function NotificationBell() {
  const t = useTranslations("Notifications");
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Queries & Mutations
  const { data: unreadCount = 0 } = useUnreadCountQuery();
  const { data: notificationData, isLoading, isError, refetch } = useNotificationsQuery(1, 10);
  const { mutate: markAsRead } = useMarkAsReadMutation();
  const { mutate: markAllAsRead } = useMarkAllAsReadMutation();
  const { mutate: deleteNotification } = useDeleteNotificationMutation();

  // FCM Configuration
  const { isTokenSynced, registerToken, unregisterToken, loading: fcmLoading } = useFcmNotification();

  const notifications = notificationData?.items || [];

  const handleNotificationClick = (item: NotificationDto) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
    setPopoverOpen(false);
    setSheetOpen(false);
    if (item.actionUrl) {
      router.push(item.actionUrl);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER_SUCCESS:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <ShoppingBag className="h-5 w-5" />
          </div>
        );
      case NotificationType.QUIZ_PASSED:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <Trophy className="h-5 w-5" />
          </div>
        );
      case NotificationType.CERTIFICATE_ISSUED:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <Award className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-500/10 text-slate-500">
            <Info className="h-5 w-5" />
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

  // Shared List component rendering
  const renderListContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 p-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <p className="text-sm text-slate-500 mb-4">{t("error_loading")}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t("retry")}
          </Button>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-bg3 mb-4 text-slate-400">
            <BellOff className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{t("empty")}</h4>
          <p className="text-xs text-slate-500 max-w-[240px]">{t("empty_desc")}</p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-brand-border">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNotificationClick(item)}
            className={`flex items-start gap-3 p-4 transition-colors relative group cursor-pointer ${
              item.isRead 
                ? "hover:bg-brand-bg3/50" 
                : "bg-brand-amber/5 hover:bg-brand-amber/10"
            }`}
          >
            {getNotificationIcon(item.type)}
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 shrink-0">
                  {getBadgeLabel(item.type)}
                </Badge>
                <span className="text-[10px] text-slate-400">
                  {formatDateTime(item.createdAt)}
                </span>
              </div>
              <h5 className={`text-xs font-semibold leading-tight text-slate-900 dark:text-white truncate ${
                item.isRead ? "" : "text-brand-amber"
              }`}>
                {item.title}
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {item.content}
              </p>
            </div>

            {/* Read/Unread dot indicator */}
            {!item.isRead && (
              <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-brand-amber shrink-0" />
            )}

            {/* Actions: Always visible on touch-screens (mobile/tablet), hover transition on desktop */}
            <div className="flex items-center gap-1 absolute right-2 bottom-2 md:right-4 md:top-1/2 md:-translate-y-1/2 md:bottom-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-brand-bg/90 md:bg-transparent rounded-md p-1 md:p-0">
              {!item.isRead && (
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={t("mark_read")}
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(item.id);
                  }}
                  className="h-9 w-9 md:h-8 md:w-8 text-slate-400 hover:text-brand-amber rounded-full hover:bg-brand-bg3 focus-visible:ring-2"
                >
                  <Check className="h-4 w-4" />
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
                className="h-9 w-9 md:h-8 md:w-8 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-500/10 focus-visible:ring-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Header settings section (push token toggle)
  const renderHeaderSettings = () => (
    <div className="flex items-center justify-between px-4 py-3 bg-brand-bg3/60 border-b border-brand-border">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {t("push_toggle")}
        </span>
        <span className="text-[10px] text-slate-400 leading-none mt-0.5">
          {t("push_toggle_desc")}
        </span>
      </div>
      <Switch
        checked={isTokenSynced}
        disabled={fcmLoading}
        onCheckedChange={(checked) => (checked ? registerToken() : unregisterToken())}
        className="data-[state=checked]:bg-brand-amber"
      />
    </div>
  );

  return (
    <>
      {/* 1. Desktop Popover */}
      <div className="hidden lg:block">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger
            render={
              <button className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-transparent text-slate-600 hover:bg-brand-bg2 hover:text-brand-amber transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-amber outline-none">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-amber text-[9px] font-black text-black ring-2 ring-brand-bg">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            }
          />
          <PopoverContent className="w-[380px] p-0 border border-brand-border bg-brand-bg shadow-xl rounded-xl z-50 overflow-hidden" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {t("title")}
                {unreadCount > 0 && (
                  <Badge className="bg-brand-amber text-black hover:bg-brand-amber/90 font-black text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsRead()}
                  className="h-8 text-xs font-semibold text-brand-amber hover:text-brand-amber2 hover:bg-transparent px-0"
                >
                  <Check className="mr-1 h-3.5 w-3.5" />
                  {t("mark_all_read")}
                </Button>
              )}
            </div>

            {renderHeaderSettings()}

            <ScrollArea className="max-h-[360px] overflow-y-auto">
              {renderListContent()}
            </ScrollArea>

            <div className="border-t border-brand-border p-2 bg-brand-bg3/30 text-center">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-amber"
                onClick={() => setPopoverOpen(false)}
              >
                <Link href="/notifications" className="inline-flex items-center justify-center gap-1.5 no-underline">
                  {t("view_all")}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 2. Mobile / Tablet Sheet */}
      <div className="lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={
              <button className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-transparent text-slate-600 hover:bg-brand-bg3 hover:text-brand-amber transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-amber outline-none">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-amber text-[9px] font-black text-black ring-2 ring-brand-bg">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            }
          />
          <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col h-full bg-brand-bg border-l border-brand-border z-50">
            <SheetHeader className="px-4 py-4 border-b border-brand-border">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {t("title")}
                  {unreadCount > 0 && (
                    <Badge className="bg-brand-amber text-black font-black text-[10px]">
                      {unreadCount}
                    </Badge>
                  )}
                </SheetTitle>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsRead()}
                    className="h-8 text-xs font-semibold text-brand-amber hover:text-brand-amber2 hover:bg-transparent px-0"
                  >
                    {t("mark_all_read")}
                  </Button>
                )}
              </div>
            </SheetHeader>

            {renderHeaderSettings()}

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {renderListContent()}
              </ScrollArea>
            </div>

            <div className="border-t border-brand-border p-4 bg-brand-bg3/25">
              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-semibold border-brand-border text-slate-700 dark:text-slate-300 hover:text-brand-amber hover:border-brand-amber"
                onClick={() => setSheetOpen(false)}
              >
                <Link href="/notifications" className="inline-flex items-center justify-center gap-1.5 no-underline">
                  {t("view_all")}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Uses right-aligned slide-out Sheet, full item size, visible buttons.
// tablet  (md / lg):       Uses Sheet layout, actions are aligned side-by-side with large touch zones.
// desktop (xl / 2xl):      Uses standard Popover overlay, actions only show on row hover, scrollable block.
// Interaction:             Min-h-[44px] on trigger buttons, easy swipe to view on smaller tablets.
