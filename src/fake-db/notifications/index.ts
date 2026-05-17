import { faker, pad, NOW, isoDate } from "../seed";
import type { Notification, NotificationKind, User } from "../types";

const MENTION_TEMPLATES = [
  "@you was mentioned in a thread by {actor}",
  "{actor} asked for your feedback on the {topic} policy",
  "{actor} replied to your comment on the catalog draft",
  "{actor} tagged you in the {topic} working doc",
];

const APPROVAL_TEMPLATES = [
  "{actor} requested approval to publish the {topic} update",
  "Approval needed: new instructor onboarding for {topic}",
  "{actor} is waiting on your sign-off for the budget memo",
  "Pending review: {topic} exemption submitted by {actor}",
];

const SYSTEM_TEMPLATES = [
  "Nightly student roster sync completed without errors",
  "Backup snapshot for the registrar database succeeded",
  "Tuition reconciliation report is ready for review",
  "Course catalog draft was auto-saved",
  "MFA enrollment is required by next Monday",
  "Two scheduled jobs failed and were retried successfully",
];

const TOPICS = [
  "academic integrity",
  "scholarship",
  "advising",
  "transcript",
  "transfer credit",
  "registration",
  "leave of absence",
];

export function buildNotifications(opts: {
  count: number;
  users: User[];
}): Notification[] {
  const { count, users } = opts;
  if (users.length < 2) return [];
  const results: Notification[] = [];

  for (let i = 0; i < count; i++) {
    const kind = faker.helpers.weightedArrayElement<NotificationKind>([
      { value: "mention", weight: 35 },
      { value: "approval", weight: 25 },
      { value: "system", weight: 40 },
    ]);
    const recipient = faker.helpers.arrayElement(users);
    const actor = faker.helpers.arrayElement(
      users.filter((u) => u.id !== recipient.id)
    );
    const topic = faker.helpers.arrayElement(TOPICS);

    let body: string;
    if (kind === "mention") {
      body = faker.helpers
        .arrayElement(MENTION_TEMPLATES)
        .replace("{actor}", actor.fullName)
        .replace("{topic}", topic);
    } else if (kind === "approval") {
      body = faker.helpers
        .arrayElement(APPROVAL_TEMPLATES)
        .replace("{actor}", actor.fullName)
        .replace("{topic}", topic);
    } else {
      body = faker.helpers.arrayElement(SYSTEM_TEMPLATES);
    }

    const hoursBack = faker.number.int({ min: 1, max: 168 });

    results.push({
      id: `notif-${pad(i + 1, 4)}`,
      kind,
      recipientUserId: recipient.id,
      body,
      timestamp: isoDate(new Date(NOW.getTime() - hoursBack * 3_600_000)),
      read: faker.helpers.weightedArrayElement([
        { value: true, weight: 55 },
        { value: false, weight: 45 },
      ]),
    });
  }

  results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return results;
}
