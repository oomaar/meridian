"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Info, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const ROOT_LABEL: Record<string, string> = {
  admin: "Aldridge University",
  instructor: "Teaching",
  student: "My program",
};

const SEGMENT_LABEL: Record<string, string> = {
  overview: "Overview",
  activity: "Activity",
  notifications: "Notifications",
  courses: "Courses",
  students: "Students",
  instructors: "Instructors",
  semesters: "Semesters",
  users: "Users & Roles",
  settings: "Settings",
  dashboard: "Today",
  grading: "Grading queue",
  deadlines: "Deadlines",
  grades: "Grades",
  announcements: "Announcements",
  roster: "Roster",
};

function prettify(seg: string): string {
  const decoded = decodeURIComponent(seg);
  return (
    SEGMENT_LABEL[decoded] ??
    decoded.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function deriveCrumbs(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return ["Meridian"];
  const root = ROOT_LABEL[segments[0]] ?? "Meridian";
  return [root, ...segments.slice(1).map(prettify)];
}

export function Topbar() {
  const pathname = usePathname();
  const crumbs = deriveCrumbs(pathname);

  return (
    <div className="m-topbar">
      <div className="m-crumbs">
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <ChevronRight size={12} className="m-crumbs__sep" />}
            {i === crumbs.length - 1 ? <b>{c}</b> : <span>{c}</span>}
          </Fragment>
        ))}
      </div>

      <div className="m-search">
        <Search className="m-search__icon" size={14} />
        <input placeholder="Search courses, people, sections…" readOnly />
        <span className="m-search__kbd">⌘K</span>
      </div>

      <div className="m-top-actions">
        <ThemeToggle />
        <button
          className="m-btn m-btn--ghost m-btn--icon"
          style={{ position: "relative" }}
          title="Notifications"
        >
          <Bell size={14} />
          <span className="m-notif-dot" />
        </button>
        <button className="m-btn m-btn--ghost m-btn--icon" title="Help">
          <Info size={14} />
        </button>
      </div>
    </div>
  );
}
