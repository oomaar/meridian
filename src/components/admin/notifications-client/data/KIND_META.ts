import { NotificationKind } from "@/fake-db";

type KIND = Record<
  NotificationKind,
  { title: string; dot: "accent" | "warning" | "info" }
>;

export const KIND_META: KIND = {
  mention: { title: "Mention", dot: "accent" },
  approval: { title: "Approval requested", dot: "warning" },
  system: { title: "System", dot: "info" },
};
