"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  BookOpen,
  Calendar,
  CalendarClock,
  ChevronsUpDown,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  PenLine,
  Settings,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PERSONAS, roleFromPath, type Role } from "@/lib/personas";
import { PersonaFooter } from "./persona-footer";
import type { StudentSidebarCourse } from "@/fake-db/dashboards";
import { BookMarked } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

type NavGroup = {
  heading: string;
  items: NavItem[];
};

const NAV: Record<Role, NavGroup[]> = {
  admin: [
    {
      heading: "Operations",
      items: [
        { href: "/admin/overview", label: "Overview", icon: LayoutDashboard },
        {
          href: "/admin/activity",
          label: "Activity",
          icon: Activity,
          badge: "12",
        },
        {
          href: "/admin/notifications",
          label: "Notifications",
          icon: Bell,
          badge: "4",
        },
      ],
    },
    {
      heading: "Academics",
      items: [
        {
          href: "/admin/courses",
          label: "Courses",
          icon: BookOpen,
          badge: "1,184",
        },
        {
          href: "/admin/students",
          label: "Students",
          icon: Users,
          badge: "14,820",
        },
        {
          href: "/admin/instructors",
          label: "Instructors",
          icon: GraduationCap,
          badge: "612",
        },
        { href: "/admin/semesters", label: "Semesters", icon: Calendar },
      ],
    },
    {
      heading: "Administration",
      items: [
        { href: "/admin/users", label: "Users & Roles", icon: UserCog },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ],
    },
  ],
  student: [
    {
      heading: "Learning",
      items: [
        { href: "/student/dashboard", label: "Today", icon: LayoutDashboard },
        {
          href: "/student/courses",
          label: "My Courses",
          icon: BookOpen,
          badge: "4",
        },
        {
          href: "/student/deadlines",
          label: "Deadlines",
          icon: CalendarClock,
          badge: "5",
        },
      ],
    },
    {
      heading: "Account",
      items: [
        { href: "/student/grades", label: "Grades", icon: Activity },
        { href: "/student/settings", label: "Settings", icon: Settings },
      ],
    },
  ],
  instructor: [
    {
      heading: "Teaching",
      items: [
        {
          href: "/instructor/dashboard",
          label: "Overview",
          icon: LayoutDashboard,
        },
        {
          href: "/instructor/grading",
          label: "Grading queue",
          icon: PenLine,
          badge: "23",
        },
        {
          href: "/instructor/courses",
          label: "My Courses",
          icon: BookOpen,
          badge: "3",
        },
        { href: "/instructor/roster", label: "Roster", icon: Users },
      ],
    },
    {
      heading: "Account",
      items: [
        {
          href: "/instructor/announcements",
          label: "Announcements",
          icon: Inbox,
        },
        { href: "/instructor/settings", label: "Settings", icon: Settings },
      ],
    },
  ],
};

const TENANT = {
  name: "Aldridge University",
  plan: "Enterprise · Spring 2026",
  crest: "A",
};

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  return pathname.startsWith(href + "/");
}

export function Sidebar({
  studentCourses,
  studentCourseCount,
  studentDeadlineCount,
}: {
  studentCourses: StudentSidebarCourse[];
  studentCourseCount: number;
  studentDeadlineCount: number;
}) {
  const pathname = usePathname();
  const role = roleFromPath(pathname);
  const persona = PERSONAS[role];
  const groups = NAV[role];

  return (
    <aside className="m-sidebar">
      <div className="m-sidebar__brand">
        <div className="m-brand-mark">M</div>
        <div className="m-brand-text">
          <b>Meridian</b>
          <span className="m-mono">v4.2 · operations</span>
        </div>
      </div>

      <div className="m-tenant" title="Switch institution">
        <div className="m-tenant__crest">{TENANT.crest}</div>
        <div className="m-tenant__meta">
          <b>{TENANT.name}</b>
          <span>{TENANT.plan}</span>
        </div>
        <ChevronsUpDown className="m-tenant__chev" size={14} />
      </div>

      <nav className="m-nav">
        {groups.map((g) => (
          <div key={g.heading} className="m-nav__group">
            <div className="m-nav__heading">{g.heading}</div>
            {g.items.map((it) => {
              const active = isActive(pathname, it.href);
              const Icon = it.icon;
              const badge =
                role === "student" && it.href === "/student/courses"
                  ? String(studentCourseCount)
                  : role === "student" && it.href === "/student/deadlines"
                    ? String(studentDeadlineCount)
                    : it.badge;
              return (
                <Fragment key={it.href}>
                  <Link
                    href={it.href}
                    className={`m-nav__item${active ? " m-nav__item--active" : ""}`}
                  >
                    <Icon className="m-nav__icon" />
                    <span>{it.label}</span>
                    {badge && <span className="m-nav__badge">{badge}</span>}
                  </Link>
                  {role === "student" &&
                    it.href === "/student/courses" &&
                    studentCourses.map((c) => {
                      const href = `/student/courses/${encodeURIComponent(c.code)}`;
                      const subActive = isActive(pathname, href);
                      return (
                        <Link
                          key={c.code}
                          href={href}
                          className={`m-nav__item m-nav__item--sub${subActive ? " m-nav__item--active" : ""}`}
                        >
                          <BookMarked className="m-nav__icon" />
                          <span className="m-mono" style={{ fontSize: 11.5 }}>
                            {c.code}
                          </span>
                        </Link>
                      );
                    })}
                </Fragment>
              );
            })}
          </div>
        ))}
      </nav>

      <PersonaFooter persona={persona} />
    </aside>
  );
}
