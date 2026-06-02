import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/shell";
import { getStudentSidebarCourses, getStudentDeadlines, getStudentNotifications } from "@/fake-db/dashboards";

export default function AppLayout({ children }: { children: ReactNode }) {
  const studentCourses = getStudentSidebarCourses();
  const deadlines = getStudentDeadlines();
  const notifications = getStudentNotifications();
  const studentNotifCount = notifications.filter((n) => !n.read).length;
  return (
    <AppShell studentCourses={studentCourses} studentCourseCount={studentCourses.length} studentDeadlineCount={deadlines.length} studentNotifCount={studentNotifCount}>
      {children}
    </AppShell>
  );
}
