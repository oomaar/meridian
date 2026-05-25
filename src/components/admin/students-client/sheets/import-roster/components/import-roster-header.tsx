import { XIcon } from "lucide-react";

type ImportRosterHeaderProps = {
  handleClose: () => void;
};

export function ImportRosterHeader({ handleClose }: ImportRosterHeaderProps) {
  return (
    <div className="m-sheet__head">
      <span className="m-sheet__title">Import roster</span>
      <button
        className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
        onClick={handleClose}
      >
        <XIcon size={15} />
      </button>
    </div>
  );
}
