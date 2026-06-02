import { XIcon } from "lucide-react";

type CourseSyllabusSheetHeaderProps = { onClose: () => void };

export function CourseSyllabusSheetHeader({
  onClose,
}: CourseSyllabusSheetHeaderProps) {
  return (
    <div className="m-sheet__head">
      <span className="m-sheet__title">Syllabus</span>
      <button
        className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
        onClick={onClose}
      >
        <XIcon size={14} />
      </button>
    </div>
  );
}
