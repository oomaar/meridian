"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import type { StudentSidebarCourse } from "@/fake-db/dashboards";
import type { CmdIndexItem } from "@/fake-db/dashboards";
import { GradingCountProvider } from "@/lib/grading-count-context";

export function AppShell({
  children,
  studentCourses,
  studentCourseCount,
  studentDeadlineCount,
  studentNotifCount,
  instructorGradingCount,
  instructorCourseCount,
  cmdIndex,
}: {
  children: ReactNode;
  studentCourses: StudentSidebarCourse[];
  studentCourseCount: number;
  studentDeadlineCount: number;
  studentNotifCount: number;
  instructorGradingCount: number;
  instructorCourseCount: number;
  cmdIndex: Record<string, CmdIndexItem[]>;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setNavOpen(false);
  }

  const close = useCallback(() => setNavOpen(false), []);
  const toggle = useCallback(() => setNavOpen((o) => !o), []);
  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
          instructorCourseCount={instructorCourseCount}
        />
        <div className="m-main">
          <Topbar onNavToggle={toggle} onSearchOpen={openCmd} />
          <div className="m-page">{children}</div>
        </div>
        {cmdOpen && <CommandPalette cmdIndex={cmdIndex} onClose={closeCmd} />}
      </div>
    </GradingCountProvider>
  );
}
