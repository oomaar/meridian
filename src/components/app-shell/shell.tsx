"use client";

import { useState, useCallback, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { StudentSidebarCourse } from "@/fake-db/dashboards";
import { GradingCountProvider } from "@/lib/grading-count-context";

export function AppShell({
  children,
  studentCourses,
  studentCourseCount,
  studentDeadlineCount,
  studentNotifCount,
  instructorGradingCount,
}: {
  children: ReactNode;
  studentCourses: StudentSidebarCourse[];
  studentCourseCount: number;
  studentDeadlineCount: number;
  studentNotifCount: number;
  instructorGradingCount: number;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setNavOpen(false);
  }

  const close = useCallback(() => setNavOpen(false), []);
  const toggle = useCallback(() => setNavOpen((o) => !o), []);

  return (
    <GradingCountProvider initial={instructorGradingCount}>
      <div className="m-app" data-nav-open={navOpen ? "" : undefined}>
        {navOpen && (
          <div className="m-nav-overlay" onClick={close} aria-hidden="true" />
        )}
        <Sidebar
          studentCourses={studentCourses}
          studentCourseCount={studentCourseCount}
          studentDeadlineCount={studentDeadlineCount}
          studentNotifCount={studentNotifCount}
        />
        <div className="m-main">
          <Topbar onNavToggle={toggle} />
          <div className="m-page">{children}</div>
        </div>
      </div>
    </GradingCountProvider>
  );
}
