import { faker } from "@faker-js/faker";

// Fresh seed per server start so two demo viewers see different data.
// (NOW stays frozen — the active semester math depends on it.)
faker.seed(Date.now());

export { faker };

export const NOW = new Date("2026-05-17T10:00:00Z");

export const SCALE = {
  instructors: 612,
  students: 14820,
  courses: 1184,
  users: 30,
  activity: 200,
  notifications: 50,
} as const;

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

export function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

export function isoDate(d: Date): string {
  return d.toISOString();
}

export function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function daysAgo(n: number): Date {
  return new Date(NOW.getTime() - n * DAY_MS);
}

export function daysFromNow(n: number): Date {
  return new Date(NOW.getTime() + n * DAY_MS);
}

export function hoursAgo(n: number): Date {
  return new Date(NOW.getTime() - n * HOUR_MS);
}

export function minutesAgo(n: number): Date {
  return new Date(NOW.getTime() - n * MINUTE_MS);
}

export function pickN<T>(items: T[], count: number): T[] {
  return faker.helpers.arrayElements(items, Math.min(count, items.length));
}
