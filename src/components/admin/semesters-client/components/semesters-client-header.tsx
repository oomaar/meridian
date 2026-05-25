import { AcademicCalendarSheet } from "../sheets/academic-calendar-sheet/academic-calendar-sheet";
import type { AdminSemesterCard } from "@/fake-db/dashboards";
import { NewTermSheet } from "../sheets/new-term-sheet/new-term-sheet";

type SemestersClientHeaderProps = {
  handleAdd(card: AdminSemesterCard): void;
  semesters: AdminSemesterCard[];
};

export default function SemestersClientHeader({
  handleAdd,
  semesters,
}: SemestersClientHeaderProps) {
  return (
    <div className="m-page__header">
      <div className="m-page__title">
        <span className="m-page__eyebrow">Operations</span>
        <h1 className="m-page__h">Semesters</h1>
        <p className="m-page__sub">Active and upcoming academic terms.</p>
      </div>
      <div className="m-page__actions">
        <AcademicCalendarSheet semesters={semesters} />
        <NewTermSheet onAdd={handleAdd} />
      </div>
    </div>
  );
}
