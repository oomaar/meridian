import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/shell";
import { getStudentSidebarCourses } from "@/fake-db/dashboards";

export default function AppLayout({ children }: { children: ReactNode }) {
  const studentCourses = getStudentSidebarCourses();
  return (
    <AppShell studentCourses={studentCourses} studentCourseCount={studentCourses.length}>
      {children}
    </AppShell>
  );
}
