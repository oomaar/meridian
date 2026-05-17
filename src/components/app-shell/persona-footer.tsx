"use client";

import { Check, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PERSONAS, ROLE_ORDER, type Persona } from "@/lib/personas";

export function PersonaFooter({ persona }: { persona: Persona }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="m-sidebar__footer" ref={wrapRef}>
      <div className="m-avatar">{persona.initials}</div>
      <div className="m-sidebar__user">
        <b>{persona.fullName}</b>
        <span>{persona.roleTitle}</span>
      </div>
      <button
        className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
        title="Switch persona"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <ul className="m-persona-menu" role="menu">
          <li className="m-persona-menu__heading">Switch persona</li>
          {ROLE_ORDER.map((role) => {
            const p = PERSONAS[role];
            const active = role === persona.role;
            return (
              <li key={role}>
                <Link
                  role="menuitem"
                  href={p.homeHref}
                  onClick={() => setOpen(false)}
                  className={
                    "m-persona-menu__item" +
                    (active ? " m-persona-menu__item--active" : "")
                  }
                >
                  <div className="m-avatar m-avatar--sm">{p.initials}</div>
                  <div className="m-persona-menu__meta">
                    <b>{p.fullName}</b>
                    <span>{p.roleTitle}</span>
                  </div>
                  {active && (
                    <Check size={14} className="m-persona-menu__check" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
