"use client";

import { useMemo } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Calendar,
  Heart,
  MessageSquare,
  Package,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildClientNotificationHref } from "@/lib/notificationRoutes";
import type { Notification, NotificationPanelProps } from "@/types/notifications";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsInfinite,
} from "@/services/useNotifications";

export function NotificationPanel({
  isOpen,
  onClose,
  onNavigate,
}: NotificationPanelProps) {
  const listQuery = useNotificationsInfinite(isOpen);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = useMemo(
    () => listQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [listQuery.data]
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return Calendar;
      case "message":
        return MessageSquare;
      case "favorite":
        return Heart;
      case "update":
        return Package;
      default:
        return Bell;
    }
  };

  const handleMarkAsRead = (id: string) => {
    markRead.mutate(id, {
      onError: () => {
        toast.error("Could not mark notification as read");
      },
    });
  };

  const handleMarkAllAsRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
      onError: () => {
        toast.error("Could not mark all notifications as read");
      },
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (onNavigate && buildClientNotificationHref(notification)) {
      onNavigate(notification);
      onClose();
    }
  };

  const isLoading = listQuery.isLoading;
  const isError = listQuery.isError;
  const hasNextPage = listQuery.hasNextPage ?? false;
  const isFetchingNextPage = listQuery.isFetchingNextPage;

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              opacity: { duration: 0.2 },
            }}
            className="fixed right-0 top-20 z-50 flex h-[calc(100vh-60px)] w-full flex-col rounded-tl-2xl rounded-bl-2xl bg-white shadow-lg sm:w-[420px] lg:h-[calc(100vh-90px)]"
          >
            <div className="border-b border-accent-20 px-6 py-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold leading-[1.4] text-secondary-000">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-100 px-2 text-xs font-semibold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent transition-colors duration-150 hover:bg-primary-300/50"
                  aria-label="Close notifications"
                >
                  <X className="size-5 text-accent-80" />
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllRead.isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-transparent px-3 py-1.5 text-sm font-semibold text-primary-100 transition-colors duration-150 hover:bg-primary-300/50 disabled:opacity-60"
                >
                  {markAllRead.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCheck className="size-4" />
                  )}
                  Mark all as read
                </button>
              )}
            </div>

            <ScrollArea className="flex-1">
              {isLoading && (
                <div className="flex flex-col items-center gap-3 py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
                  <p className="text-sm text-accent-80">Loading notifications…</p>
                </div>
              )}

              {isError && !isLoading && (
                <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                  <p className="text-base font-semibold text-secondary-000">
                    Could not load notifications
                  </p>
                  <p className="text-sm text-accent-80">
                    Check your connection and try again.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-accent-20"
                    onClick={() => listQuery.refetch()}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {!isLoading && !isError && notifications.length === 0 && (
                <div className="flex flex-col items-center gap-3 px-6 py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-300">
                    <Bell className="size-7 text-accent-80" />
                  </div>
                  <div className="text-center">
                    <p className="mb-1 text-base font-semibold text-secondary-000">
                      No notifications
                    </p>
                    <p className="text-sm text-accent-80">You&apos;re all caught up!</p>
                  </div>
                </div>
              )}

              {!isLoading && !isError && notifications.length > 0 && (
                <div>
                  {notifications.map((notification, index) => {
                    const Icon = getIcon(notification.type);
                    const isLast = index === notifications.length - 1;
                    const isMarkingThis =
                      markRead.isPending && markRead.variables === notification.id;

                    return (
                      <div key={notification.id}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => handleNotificationClick(notification)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleNotificationClick(notification);
                            }
                          }}
                          className={cn(
                            "relative cursor-pointer px-6 py-4 transition-colors duration-150",
                            notification.isRead
                              ? "bg-transparent hover:bg-primary-300/50"
                              : "bg-primary-300/50"
                          )}
                        >
                          <div className="flex gap-3">
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                                notification.isRead ? "bg-accent-20" : "bg-primary-100"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "size-5",
                                  notification.isRead ? "text-accent-80" : "text-white"
                                )}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold leading-[1.4] text-secondary-000">
                                  {notification.title}
                                </p>
                                <span className="shrink-0 whitespace-nowrap text-xs text-accent-80">
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm leading-normal text-accent-80">
                                {notification.message}
                              </p>
                            </div>

                            {!notification.isRead && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                disabled={isMarkingThis}
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-transparent transition-colors duration-150 hover:bg-accent-20 disabled:opacity-50"
                                title="Mark as read"
                                aria-label="Mark as read"
                              >
                                {isMarkingThis ? (
                                  <Loader2 className="size-4 animate-spin text-accent-80" />
                                ) : (
                                  <Check className="size-4 text-accent-80" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        {!isLast && <Separator className="bg-accent-20" />}
                      </div>
                    );
                  })}

                  {hasNextPage && (
                    <div className="border-t border-accent-20 px-6 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-full border-accent-20 font-unageo text-sm font-semibold"
                        disabled={isFetchingNextPage}
                        onClick={() => listQuery.fetchNextPage()}
                      >
                        {isFetchingNextPage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading…
                          </>
                        ) : (
                          "Load more"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
