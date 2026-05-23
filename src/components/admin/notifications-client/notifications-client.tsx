"use client";

import { useState } from "react";
import type { Notification } from "@/fake-db/types";
import { NotificationsInbox } from "./components/notifications-inbox";
import { NotificationsChannels } from "./components/notifications-channels";
import { NotificationsThresholds } from "./components/notifications-thresholds";
import { NotificationsHeader } from "./components/notifications-header";

type NotificationsClientProps = {
  notifications: Notification[];
};

export type FilterState = "all" | "unread";

export function NotificationsClient({
  notifications,
}: NotificationsClientProps) {
  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(notifications.filter((n) => n.read).map((n) => n.id)),
  );

  function isRead(id: string) {
    return readIds.has(id);
  }

  function markAllRead() {
    setReadIds(new Set(notifications.map((n) => n.id)));
  }

  function markRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
  }

  const unreadCount = notifications.filter((n) => !isRead(n.id)).length;

  return (
    <>
      <NotificationsHeader
        unreadCount={unreadCount}
        markAllRead={markAllRead}
      />
      <div className="m-page__body">
        <div className="m-grid m-grid-2-1">
          <NotificationsInbox
            markRead={markRead}
            notifications={notifications}
            unreadCount={unreadCount}
            isRead={isRead}
          />
          <div className="m-stack">
            <NotificationsChannels />
            <NotificationsThresholds />
          </div>
        </div>
      </div>
    </>
  );
}
