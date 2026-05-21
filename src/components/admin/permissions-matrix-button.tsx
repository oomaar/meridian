"use client";

import { useState } from "react";
import { ShieldIcon, XIcon, CheckIcon, MinusIcon } from "lucide-react";

type Access = "full" | "read" | "none";

type PermCategory = { id: string; label: string };
type PermRole     = { id: string; label: string; color: string };

const CATEGORIES: PermCategory[] = [
  { id: "system",      label: "System config"       },
  { id: "users",       label: "User management"     },
  { id: "students",    label: "Student records"      },
  { id: "courses",     label: "Course catalog"       },
  { id: "grades",      label: "Grades & transcripts" },
  { id: "financial",   label: "Financial"            },
  { id: "reporting",   label: "Reporting"            },
  { id: "support",     label: "Platform support"     },
];

const ROLES: PermRole[] = [
  { id: "admin",     label: "Admin",      color: "var(--m-danger)"  },
  { id: "registrar", label: "Registrar",  color: "var(--m-accent)"  },
  { id: "dean",      label: "Dean",       color: "var(--m-warning)" },
  { id: "faculty",   label: "Faculty",    color: "var(--m-info)"    },
  { id: "ta",        label: "TA",         color: "var(--m-success)" },
  { id: "student",   label: "Student",    color: "var(--m-text-2)"  },
];

// Matrix: MATRIX[category][role] = access level
const MATRIX: Record<string, Record<string, Access>> = {
  system:    { admin: "full", registrar: "none",  dean: "none",  faculty: "none", ta: "none",  student: "none" },
  users:     { admin: "full", registrar: "read",  dean: "read",  faculty: "none", ta: "none",  student: "none" },
  students:  { admin: "full", registrar: "full",  dean: "read",  faculty: "read", ta: "read",  student: "read" },
  courses:   { admin: "full", registrar: "full",  dean: "full",  faculty: "full", ta: "read",  student: "read" },
  grades:    { admin: "full", registrar: "full",  dean: "read",  faculty: "full", ta: "read",  student: "read" },
  financial: { admin: "full", registrar: "read",  dean: "none",  faculty: "none", ta: "none",  student: "read" },
  reporting: { admin: "full", registrar: "full",  dean: "full",  faculty: "read", ta: "none",  student: "none" },
  support:   { admin: "full", registrar: "read",  dean: "read",  faculty: "read", ta: "read",  student: "read" },
};

function AccessCell({ access }: { access: Access }) {
  if (access === "full") {
    return (
      <span className="m-perm-cell m-perm-cell--full">
        <CheckIcon size={11} /> Full
      </span>
    );
  }
  if (access === "read") {
    return (
      <span className="m-perm-cell m-perm-cell--read">
        <MinusIcon size={11} /> Read
      </span>
    );
  }
  return (
    <span className="m-perm-cell m-perm-cell--none">—</span>
  );
}

export function PermissionsMatrixButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn" onClick={() => setOpen(true)}>
        <ShieldIcon size={14} /> Permissions matrix
      </button>

      {open && (
        <>
          <div className="m-sheet-overlay" onClick={() => setOpen(false)} />
          <div className="m-sheet m-sheet--wide" role="dialog" aria-modal="true" aria-label="Permissions matrix">
            <div className="m-sheet__head">
              <span className="m-sheet__title">Permissions matrix</span>
              <button
                className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
                onClick={() => setOpen(false)}
              >
                <XIcon size={15} />
              </button>
            </div>

            <div className="m-sheet__body">
              <p style={{ fontSize: 13, color: "var(--m-text-3)", lineHeight: 1.6, marginBottom: 4 }}>
                Read-only summary of permission levels per role and category.
                Changes require an IT admin and go through the governance review.
              </p>

              <div className="m-perm-table-wrap">
                <table className="m-perm-table">
                  <thead>
                    <tr>
                      <th className="m-perm-table__cat-head">Category</th>
                      {ROLES.map((r) => (
                        <th key={r.id} className="m-perm-table__role-head">
                          <span className="m-perm-role-badge" style={{ "--role-color": r.color } as React.CSSProperties}>
                            <span className="m-perm-role-badge__dot" />
                            {r.label}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CATEGORIES.map((cat) => (
                      <tr key={cat.id}>
                        <td className="m-perm-table__cat">{cat.label}</td>
                        {ROLES.map((role) => (
                          <td key={role.id} className="m-perm-table__cell">
                            <AccessCell access={MATRIX[cat.id][role.id]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="m-perm-legend">
                <span className="m-perm-cell m-perm-cell--full"><CheckIcon size={11} /> Full — create, read, update, delete</span>
                <span className="m-perm-cell m-perm-cell--read"><MinusIcon size={11} /> Read — view only</span>
                <span className="m-perm-cell m-perm-cell--none">— No access</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
