"use client";

import { useState, useCallback, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState("");
  const pathname = usePathname();

  // Close nav on navigation without an effect (React derived-state pattern)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setNavOpen(false);
  }

  const close = useCallback(() => setNavOpen(false), []);
  const toggle = useCallback(() => setNavOpen((o) => !o), []);

  return (
    <div className="m-app" data-nav-open={navOpen ? "" : undefined}>
      {navOpen && (
        <div className="m-nav-overlay" onClick={close} aria-hidden="true" />
      )}
      <Sidebar />
      <div className="m-main">
        <Topbar onNavToggle={toggle} />
        <div className="m-page">{children}</div>
      </div>
    </div>
  );
}
