"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, X, Trash2, Calendar, Heart, MessageSquare, Package } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Notification, NotificationPanelProps } from "@/types/notifications";

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your appointment with ZuriGlow Beauty Hub is confirmed for Dec 15, 2024",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    actionUrl: "dashboard-appointments",
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    message: "Bite & Serve Catering sent you a message about your order",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isRead: false,
    actionUrl: "dashboard-appointments",
  },
  {
    id: "3",
    type: "favorite",
    title: "Vendor Update",
    message: "SweetCrust Bakery has new menu items available",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    isRead: true,
    actionUrl: "vendor-sweetcrust-bakery",
  },
  {
    id: "4",
    type: "update",
    title: "Service Completed",
    message: "Your session with FrameTime Studio is now complete. Leave a review!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true,
    actionUrl: "dashboard-appointments",
  },
  {
    id: "5",
    type: "booking",
    title: "Upcoming Appointment",
    message: "Reminder: Your appointment with Femi Digital Studios is tomorrow at 2:00 PM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isRead: true,
    actionUrl: "dashboard-appointments",
  },
];

export function NotificationPanel({ isOpen, onClose, onNavigate }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

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

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl && onNavigate) {
      onNavigate(notification.actionUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
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

      {/* Panel */}
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
            className="fixed right-0 top-20 z-50 w-full sm:w-[420px] h-[calc(100vh-60px)] lg:h-[calc(100vh-90px)] flex flex-col bg-white rounded-tl-2xl rounded-bl-2xl shadow-lg"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-accent-20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-secondary-000 font-semibold text-xl leading-[1.4]">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-primary-100 text-white text-xs font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent hover:bg-primary-300/50 transition-colors duration-150"
                >
                  <X className="size-5 text-accent-80" />
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent hover:bg-primary-300/50 transition-colors duration-150 text-primary-100 font-semibold text-sm"
                >
                  <CheckCheck className="size-4" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 px-6">
                  <div className="w-16 h-16 rounded-full bg-primary-300 flex items-center justify-center">
                    <Bell className="size-7 text-accent-80" />
                  </div>
                  <div className="text-center">
                    <p className="text-secondary-000 font-semibold text-base mb-1">No notifications</p>
                    <p className="text-accent-80 text-sm">You're all caught up!</p>
                  </div>
                </div>
              ) : (
                <div>
                  {notifications.map((notification, index) => {
                    const Icon = getIcon(notification.type);
                    const isLast = index === notifications.length - 1;
                    return (
                      <div key={notification.id}>
                        <div
                          onClick={() => handleNotificationClick(notification)}
                          className={cn(
                            "px-6 py-4 cursor-pointer transition-colors duration-150 relative",
                            notification.isRead ? "bg-transparent hover:bg-primary-300/50" : "bg-primary-300/50"
                          )}
                        >
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                notification.isRead ? "bg-accent-20" : "bg-primary-100"
                              )}
                            >
                              <Icon className={cn("size-5", notification.isRead ? "text-accent-80" : "text-white")} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="text-secondary-000 font-semibold text-sm leading-[1.4]">{notification.title}</p>
                                <span className="text-accent-80 text-xs whitespace-nowrap shrink-0">
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                              </div>
                              <p className="text-accent-80 text-sm leading-normal">{notification.message}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-start gap-1">
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent hover:bg-accent-20 transition-colors duration-150"
                                  title="Mark as read"
                                >
                                  <Check className="size-4 text-accent-80" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent hover:bg-red-50 transition-colors duration-150"
                                title="Delete"
                              >
                                <Trash2 className="size-4 text-accent-80" />
                              </button>
                            </div>
                          </div>
                        </div>
                        {!isLast && <Separator className="bg-accent-20" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
