import { CheckIcon, MinusIcon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { PERMISSIONS_ROLES } from "./data/PERMISSIONS_ROLES";
import { CATEGORIES } from "./data/CATEGORIES";
import { MATRIX } from "./data/MATRIX";
import { PermissionsMatrixSheetAccessCell } from "./permissions-matrix-sheet-access-cell";

type PermissionsMatrixSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function PermissionsMatrixSheetDrawer({
  setOpen,
}: PermissionsMatrixSheetDrawerProps) {
  return (
    <>
      <div className="m-sheet-overlay" onClick={() => setOpen(false)} />
      <div
        className="m-sheet m-sheet--wide"
        role="dialog"
        aria-modal="true"
        aria-label="Permissions matrix"
      >
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
          <p className="text-[13px] text-m-text-3 leading-[1.6] mb-1">
            Read-only summary of permission levels per role and category.
            Changes require an IT admin and go through the governance review.
          </p>
          <div className="m-perm-table-wrap">
            <table className="m-perm-table">
              <thead>
                <tr>
                  <th className="m-perm-table__cat-head">Category</th>
                  {PERMISSIONS_ROLES.map((r) => (
                    <th key={r.id} className="m-perm-table__role-head">
                      <span className="m-perm-role-badge">
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
                    {PERMISSIONS_ROLES.map((role) => (
                      <td key={role.id} className="m-perm-table__cell">
                        <PermissionsMatrixSheetAccessCell
                          access={MATRIX[cat.id][role.id]}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="m-perm-legend">
            <span className="m-perm-cell m-perm-cell--full">
              <CheckIcon size={11} /> Full — create, read, update, delete
            </span>
            <span className="m-perm-cell m-perm-cell--read">
              <MinusIcon size={11} /> Read — view only
            </span>
            <span className="m-perm-cell m-perm-cell--none">— No access</span>
          </div>
        </div>
      </div>
    </>
  );
}
