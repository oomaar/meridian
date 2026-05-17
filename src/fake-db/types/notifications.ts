export type NotificationKind = "mention" | "approval" | "system";

export type Notification = {
  id: string;
  kind: NotificationKind;
  recipientUserId: string;
  body: string;
  link?: string;
  timestamp: string;
  read: boolean;
};
