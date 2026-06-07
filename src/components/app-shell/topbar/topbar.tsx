"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Info,
  Menu,
  Search,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { deriveCrumbs } from "./helpers/deriveCrumbs";
import { notifHref } from "./helpers/notifHref";
import { HelpSheet } from "./help-sheet";

type TopbarProps = {
  onNavToggle?: () => void;
  onSearchOpen?: () => void;
};

export function Topbar({ onNavToggle, onSearchOpen }: TopbarProps) {
  const pathname = usePathname();
  const crumbs = deriveCrumbs(pathname);
  const notifUrl = notifHref(pathname);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <div className="m-topbar">
        <button
          className="m-nav-toggle"
          onClick={onNavToggle}
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>
        <div className="m-crumbs">
          {crumbs.map((c, i) => (
            <Fragment key={i}>
              {i > 0 && <ChevronRight size={12} className="m-crumbs__sep" />}
              {c.href ? (
                <Link href={c.href} className="m-crumbs__link">
                  {c.label}
                </Link>
              ) : (
                <b>{c.label}</b>
              )}
            </Fragment>
          ))}
        </div>

        <div
          className="m-search"
          role="button"
          tabIndex={0}
          onClick={onSearchOpen}
          onKeyDown={(e) => e.key === "Enter" && onSearchOpen?.()}
        >
          <Search className="m-search__icon" size={14} />
          <input
            placeholder="Search courses, people, sections…"
            readOnly
            tabIndex={-1}
          />
          <span className="m-search__kbd">⌘K</span>
        </div>

        <div className="m-top-actions">
          <Link
            href="/"
            className="m-btn m-btn--ghost m-btn--sm m-topbar-landing"
          >
            <ChevronLeft size={12} /> Landing
          </Link>
          <ThemeToggle />
          <Link
            href={notifUrl}
            className="m-btn m-btn--ghost m-btn--icon"
            title="Notifications"
          >
            <Bell size={14} />
            <span className="m-notif-dot" />
          </Link>
          <button
            className="m-btn m-btn--ghost m-btn--icon"
            title="Help"
            onClick={() => setHelpOpen(true)}
          >
            <Info size={14} />
          </button>
        </div>
      </div>

      {helpOpen && <HelpSheet onClose={() => setHelpOpen(false)} />}
    </>
  );
}
