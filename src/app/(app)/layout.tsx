import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/shell";
import { getStudentSidebarCourses, getStudentDeadlines } from "@/fake-db/dashboards";

export default function AppLayout({ children }: { children: ReactNode }) {
  const studentCourses = getStudentSidebarCourses();
  const deadlines = getStudentDeadlines();
  return (
    <AppShell studentCourses={studentCourses} studentCourseCount={studentCourses.length} studentDeadlineCount={deadlines.length}>
      {children}
    </AppShell>
  );
}
