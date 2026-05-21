"use client";

import { useState, useEffect, useRef } from "react";
import { CheckIcon, MoreHorizontalIcon, FilterIcon, Trash2Icon } from "lucide-react";
import type { AdminUserRow, AdminUsersData, RoleSummaryCard } from "@/fake-db/dashboards";
import type { UserStatus } from "@/fake-db/types";
import { InviteUserButton } from "./invite-user-button";
import { PermissionsMatrixButton } from "./permissions-matrix-button";

const PAGE_SIZE = 15;

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#7895b5", "#9a7fc4", "#c19a6b", "#7ea668",
  "#d09757", "#c46a5a", "#6b9eb5", "#b57895",
];

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const parts = name.split(" ").filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0]?.[0] ?? "?").toUpperCase();
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  const bg = AVATAR_COLORS[h % AVATAR_COLORS.length];
  return (
    <span className={`m-avatar m-avatar--${size}`} style={{ background: bg }}>
      {initials}
    </span>
  );
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function MfaBadge({ mfa }: { mfa: boolean }) {
  return mfa ? (
    <span className="m-badge m-badge--success">
      <CheckIcon /> Required
    </span>
  ) : (
    <span className="m-badge m-badge--warning">Not set</span>
  );
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { label: string; mod: string }> = {
    active:    { label: "Active",    mod: "success" },
    invited:   { label: "Invited",   mod: "info"    },
    suspended: { label: "Suspended", mod: "danger"  },
  };
  const { label, mod } = map[status];
  return <span className={`m-badge m-badge--${mod}`}>{label}</span>;
}

// ─── Filter dropdown ──────────────────────────────────────────────────────────

function FilterMenu<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="m-pos-rel">
      <button className="m-filter" onClick={() => setOpen((p) => !p)}>
        <FilterIcon size={12} /> {label}: <b>{selected?.label ?? value}</b>
      </button>
      {open && (
        <div className="m-filter-menu">
          {options.map((o) => (
            <button
              key={o.value}
              className={`m-filter-menu__item${o.value === value ? " m-filter-menu__item--active" : ""}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Row menu ─────────────────────────────────────────────────────────────────

function RowMenu({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen]             = useState(false);
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="m-pos-rel">
      <button
        className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); setConfirming(false); }}
      >
        <MoreHorizontalIcon size={14} />
      </button>

      {open && (
        <div className="m-card-menu" onMouseDown={(e) => e.stopPropagation()}>
          {confirming ? (
            <div className="m-card-menu__confirm">
              <span className="m-card-menu__confirm-label">Remove this user?</span>
              <div className="m-card-menu__confirm-actions">
                <button
                  className="m-btn m-btn--ghost m-btn--sm"
                  onClick={(e) => { e.stopPropagation(); setConfirming(false); }}
                >
                  Cancel
                </button>
                <button
                  className="m-btn m-btn--ghost m-btn--sm m-btn--danger"
                  onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false); setConfirming(false); }}
                >
                  <Trash2Icon size={12} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <button
              className="m-card-menu__item m-card-menu__item--danger"
              onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
            >
              <Trash2Icon size={13} className="m-card-menu__icon" /> Delete user
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Role summary cards ───────────────────────────────────────────────────────

function RoleCard({ card }: { card: RoleSummaryCard }) {
  return (
    <div className="m-card m-role-card">
      <div className="m-role-card__head">
        <span className="m-role-card__dot" style={{ background: card.color }} />
        <b className="m-role-card__name">{card.name}</b>
        <span className="m-spacer" />
        <span className="m-role-card__count m-mono">{card.count.toLocaleString()}</span>
      </div>
      <div className="m-role-card__scope">{card.scope}</div>
    </div>
  );
}

// ─── Main client ──────────────────────────────────────────────────────────────

type RoleFilter   = "all" | "admin" | "registrar" | "admissions" | "it" | "dean" | "faculty" | "ta" | "student";
type StatusFilter = "all" | "active" | "invited" | "suspended";

const ROLE_OPTS: { value: RoleFilter; label: string }[] = [
  { value: "all",        label: "All"           },
  { value: "admin",      label: "Administrator" },
  { value: "registrar",  label: "Registrar"     },
  { value: "admissions", label: "Admissions"    },
  { value: "it",         label: "IT Staff"      },
  { value: "dean",       label: "Dean & Chair"  },
  { value: "faculty",    label: "Faculty"       },
  { value: "ta",         label: "Teaching Asst." },
  { value: "student",    label: "Student"       },
];

const STATUS_OPTS: { value: StatusFilter; label: string }[] = [
  { value: "all",       label: "All"       },
  { value: "active",    label: "Active"    },
  { value: "invited",   label: "Invited"   },
  { value: "suspended", label: "Suspended" },
];

export function UsersClient({ data }: { data: AdminUsersData }) {
  const [search,  setSearch]  = useState("");
  const [role,    setRole]    = useState<RoleFilter>("all");
  const [status,  setStatus]  = useState<StatusFilter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [rows,    setRows]    = useState<AdminUserRow[]>(data.rows);

  function resetPage() { setVisible(PAGE_SIZE); }

  const filtered = rows.filter((r) => {
    if (role !== "all"   && r.roleId !== role) return false;
    if (status !== "all" && r.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.fullName.toLowerCase().includes(q) && !r.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const visible_rows = filtered.slice(0, visible);

  function handleAdd(row: AdminUserRow) {
    setRows((prev) => [row, ...prev]);
  }

  return (
    <>
      {/* Page header */}
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Administration</span>
          <h1 className="m-page__h">Users &amp; roles</h1>
          <p className="m-page__sub">
            {data.total.toLocaleString()} accounts · 6 role tiers · access governed by departmental scopes.
          </p>
        </div>
        <div className="m-page__actions">
          <PermissionsMatrixButton />
          <InviteUserButton onAdd={handleAdd} />
        </div>
      </div>

      {/* Body */}
      <div className="m-page__body">
        <div className="m-stack">

          {/* Role summary grid */}
          <div className="m-grid m-grid-3">
            {data.roleSummaries.map((card) => (
              <RoleCard key={card.id} card={card} />
            ))}
          </div>

          {/* All users table */}
          <div className="m-card">
            <div className="m-card__head">
              <div>
                <div className="m-card__title">All users</div>
                <div className="m-card__sub">system accounts · {data.total.toLocaleString()} total</div>
              </div>
              <div className="m-spacer" />
              <div className="m-card-filters">
                <input
                  className="m-field__input m-users-search"
                  placeholder="Search name or email…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setVisible(PAGE_SIZE); }}
                />
                <FilterMenu
                  label="Role"
                  value={role}
                  options={ROLE_OPTS}
                  onChange={(v) => { setRole(v); resetPage(); }}
                />
                <FilterMenu
                  label="Status"
                  value={status}
                  options={STATUS_OPTS}
                  onChange={(v) => { setStatus(v); resetPage(); }}
                />
              </div>
            </div>

            <div className="m-card__body--flush">
              <table className="m-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }} />
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>MFA</th>
                    <th>Last login</th>
                    <th>Status</th>
                    <th style={{ width: 32 }} />
                  </tr>
                </thead>
                <tbody>
                  {visible_rows.map((u) => (
                    <tr key={u.id}>
                      <td><Avatar name={u.fullName} size="sm" /></td>
                      <td className="m-fw-500">{u.fullName}</td>
                      <td className="m-mono m-td-dim">{u.email}</td>
                      <td>
                        <span className="m-role-pill" style={{ "--role-color": u.roleColor } as React.CSSProperties}>
                          <span className="m-role-pill__dot" />
                          {u.roleLabel}
                        </span>
                      </td>
                      <td><MfaBadge mfa={u.mfa} /></td>
                      <td className="m-mono m-text-3">{u.lastLogin}</td>
                      <td><UserStatusBadge status={u.status} /></td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <RowMenu onDelete={() => setRows((prev) => prev.filter((r) => r.id !== u.id))} />
                      </td>
                    </tr>
                  ))}
                  {visible_rows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="m-table-empty">
                        No users match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {visible < filtered.length && (
                <div style={{ padding: "12px 18px", borderTop: "1px solid var(--m-line)" }}>
                  <button
                    className="m-btn m-btn--ghost"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  >
                    Load more ({filtered.length - visible} remaining)
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
