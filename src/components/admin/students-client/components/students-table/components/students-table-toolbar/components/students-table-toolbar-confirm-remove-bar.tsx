import { Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type StudentsTableToolbarConfirmRemoveBarProps = {
  selected: Set<string>;
  setConfirmRemove: Dispatch<SetStateAction<boolean>>;
  handleRemoveConfirmed(): void;
};

export function StudentsTableToolbarConfirmRemoveBar({
  selected,
  setConfirmRemove,
  handleRemoveConfirmed,
}: StudentsTableToolbarConfirmRemoveBarProps) {
  return (
    <div className="m-bulk-bar">
      <span className="m-bulk-bar__count m-text-danger">
        Remove {selected.size} student{selected.size !== 1 ? "s" : ""}?
      </span>
      <button
        className="m-btn m-btn--ghost m-btn--sm"
        onClick={() => setConfirmRemove(false)}
      >
        Cancel
      </button>
      <button
        className="m-btn m-btn--sm m-btn--danger"
        onClick={handleRemoveConfirmed}
      >
        <Trash2Icon size={12} /> Confirm remove
      </button>
    </div>
  );
}
