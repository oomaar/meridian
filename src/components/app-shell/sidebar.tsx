"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  BookMarked,
  BookOpen,
  Calendar,
  CalendarClock,
  ChevronsUpDown,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  MoreHorizontal,
  PenLine,
  Settings,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

type Role = "admin" | "instructor" | "student";

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
        { href: "/admin/activity", label: "Activity", icon: Activity, badge: "12" },
        { href: "/admin/notifications", label: "Notifications", icon: Bell, badge: "4" },
      ],
    },
    {
      heading: "Academics",
      items: [
        { href: "/admin/courses", label: "Courses", icon: BookOpen, badge: "1,184" },
        { href: "/admin/students", label: "Students", icon: Users, badge: "14,820" },
        { href: "/admin/instructors", label: "Instructors", icon: GraduationCap, badge: "612" },
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
        { href: "/student/courses", label: "My Courses", icon: BookOpen, badge: "4" },
        {
          href: "/student/courses/CS-240",
          label: "CS-240 · Distributed Systems",
          icon: BookMarked,
        },
        { href: "/student/deadlines", label: "Deadlines", icon: CalendarClock, badge: "5" },
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
        { href: "/instructor/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/instructor/grading", label: "Grading queue", icon: PenLine, badge: "23" },
        { href: "/instructor/courses", label: "My Courses", icon: BookOpen, badge: "3" },
        { href: "/instructor/roster", label: "Roster", icon: Users },
      ],
    },
    {
      heading: "Account",
      items: [
        { href: "/instructor/announcements", label: "Announcements", icon: Inbox },
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

const USER = { name: "Ines Halvorsen", initials: "IH" };

const ROLE_TITLES: Record<Role, string> = {
  admin: "Registrar",
  instructor: "Faculty",
  student: "Student",
};

function roleFromPath(pathname: string): Role {
  if (pathname.startsWith("/instructor")) return "instructor";
  if (pathname.startsWith("/student")) return "student";
  return "admin";
}

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  return pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();
  const role = roleFromPath(pathname);
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
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`m-nav__item${active ? " m-nav__item--active" : ""}`}
                >
                  <Icon className="m-nav__icon" />
                  <span>{it.label}</span>
                  {it.badge && <span className="m-nav__badge">{it.badge}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="m-sidebar__footer">
        <div className="m-avatar">{USER.initials}</div>
        <div className="m-sidebar__user">
          <b>{USER.name}</b>
          <span>{ROLE_TITLES[role]}</span>
        </div>
        <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm" title="Account">
          <MoreHorizontal size={14} />
        </button>
      </div>
    </aside>
  );
}
