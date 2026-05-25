import { CheckIcon, MinusIcon } from "lucide-react";
import { PrmissionsAccess } from "./types/PrmissionsAccess";

type PermissionsMatrixSheetAccessCellProps = { access: PrmissionsAccess };

export function PermissionsMatrixSheetAccessCell({
  access,
}: PermissionsMatrixSheetAccessCellProps) {
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
  return <span className="m-perm-cell m-perm-cell--none">—</span>;
}
