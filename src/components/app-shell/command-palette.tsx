"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CalendarClock,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  PenLine,
  Search,
  Settings,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CmdIconName, CmdIndexItem } from "@/fake-db/dashboards";

const ICON_MAP: Record<CmdIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  activity: Activity,
  bell: Bell,
  book: BookOpen,
  users: Users,
  graduation: GraduationCap,
  calendar: Calendar,
  "calendar-clock": CalendarClock,
  "user-cog": UserCog,
  settings: Settings,
  pen: PenLine,
  inbox: Inbox,
};

type Role = "admin" | "student" | "instructor";

function roleFromPath(pathname: string): Role {
  const seg = pathname.split("/")[1];
  if (seg === "admin" || seg === "student" || seg === "instructor") return seg;
  return "admin";
}

function match(item: CmdIndexItem, q: string): boolean {
  const s = q.toLowerCase();
  return (
    item.label.toLowerCase().includes(s) ||
    (item.sub?.toLowerCase().includes(s) ?? false)
  );
}

export function CommandPalette({
  cmdIndex,
  onClose,
}: {
  cmdIndex: Record<string, CmdIndexItem[]>;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const role = roleFromPath(pathname);
  const allItems: CmdIndexItem[] = useMemo(
    () => cmdIndex[role] ?? [],
    [cmdIndex, role],
  );

  const items = useMemo(() => {
    if (!query.trim()) return allItems.filter((i) => i.group === "Pages");
    return allItems.filter((i) => match(i, query));
  }, [allItems, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CmdIndexItem[]>();
    for (const item of items) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }
    return map;
  }, [items]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  const navigate = useCallback(
    (item: CmdIndexItem) => {
      router.push(item.href);
      onClose();
    },
    [router, onClose],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        const item = items[selected];
        if (item) navigate(item);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, selected, navigate, onClose]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${selected}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  let flatIdx = 0;

  return (
    <>
      <div className="m-cmd-overlay" onClick={onClose} />
      <div
        className="m-cmd"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="m-cmd__search">
          <Search className="m-cmd__search-icon" size={16} />
          <input
            ref={inputRef}
            className="m-cmd__input"
            placeholder="Search pages, courses, people…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
          />
        </div>

        <div className="m-cmd__list" ref={listRef}>
          {items.length === 0 ? (
            <div className="m-cmd__empty">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            Array.from(groups.entries()).map(([group, groupItems]) => (
              <div key={group}>
                <div className="m-cmd__group-label">{group}</div>
                {groupItems.map((item) => {
                  const idx = flatIdx++;
                  const sel = idx === selected;
                  const Icon = ICON_MAP[item.icon];
                  return (
                    <button
                      key={item.id}
                      className={`m-cmd__item${sel ? " m-cmd__item--selected" : ""}`}
                      data-idx={idx}
                      onMouseEnter={() => setSelected(idx)}
                      onClick={() => navigate(item)}
                    >
                      <div className="m-cmd__item-icon">
                        <Icon size={14} />
                      </div>
                      <div className="m-cmd__item-body">
                        <div className="m-cmd__item-label">{item.label}</div>
                        {item.sub && (
                          <div className="m-cmd__item-sub">{item.sub}</div>
                        )}
                      </div>
                      <ArrowRight size={13} className="m-cmd__item-arrow" />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="m-cmd__footer">
          <span className="m-cmd__hint">
            <kbd>↑↓</kbd> navigate
          </span>
          <span className="m-cmd__hint">
            <kbd>↵</kbd> open
          </span>
          <span className="m-cmd__hint">
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </>
  );
}
