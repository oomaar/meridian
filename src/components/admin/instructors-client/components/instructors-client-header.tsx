import { Dispatch, SetStateAction } from "react";
import { ExportStudentsButton } from "../../students-client/components/export-students-button";
import { InviteInstructorSheet } from "../invite-instructor-sheet/invite-instructor-sheet";
import type { AdminInstructorRow } from "@/fake-db/dashboards";

type InstructorsClientHeaderProps = {
  total: number;
  setExtra: Dispatch<SetStateAction<AdminInstructorRow[]>>;
};

export function InstructorsClientHeader({
  total,
  setExtra,
}: InstructorsClientHeaderProps) {
  return (
    <div className="m-page__header">
      <div className="m-page__title">
        <span className="m-page__eyebrow">Academics · Spring 2026</span>
        <h1 className="m-page__h">Instructors</h1>
        <p className="m-page__sub">
          {total.toLocaleString()} faculty across 15 departments.
        </p>
      </div>
      <div className="m-page__actions">
        <ExportStudentsButton />
        <InviteInstructorSheet
          onAdd={(row) => setExtra((prev) => [row, ...prev])}
        />
      </div>
    </div>
  );
}
