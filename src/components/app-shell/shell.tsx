"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => setNavOpen(false), []);
  const toggle = useCallback(() => setNavOpen((o) => !o), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

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
