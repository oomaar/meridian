import { AdminCourseDTO, AdminCourseRosterRow } from "@/fake-db/dashboards";
import { CheckIcon, DownloadIcon, InboxIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { ComposeSheet } from "../../../sheets/compose-sheet";

type RosterHeaderProps = {
  course: AdminCourseDTO;
  roster: AdminCourseRosterRow[];
};

export function RosterHeader({ course, roster }: RosterHeaderProps) {
  const [msgAllStudentsOpen, setMsgAllStudentsOpen] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "exporting" | "done">(
    "idle",
  );

  function handleExport() {
    if (exportState !== "idle") return;
    setExportState("exporting");
    setTimeout(() => {
      setExportState("done");
      setTimeout(() => setExportState("idle"), 2000);
    }, 1400);
  }

  return (
    <>
      <div className="m-card__head">
        <span className="m-card__title">
          Roster · {roster.length} of {course.cap} enrolled
        </span>
        <div className="m-spacer" />
        <button
          className="m-btn m-btn--sm"
          onClick={() => setMsgAllStudentsOpen(true)}
        >
          <InboxIcon size={12} /> Message all
        </button>
        <button
          className="m-btn m-btn--sm"
          disabled={exportState === "exporting"}
          onClick={handleExport}
        >
          {exportState === "idle" && (
            <>
              <DownloadIcon size={12} /> Export CSV
            </>
          )}
          {exportState === "exporting" && (
            <>
              <Loader2Icon size={12} className="m-spin" /> Exporting…
            </>
          )}
          {exportState === "done" && (
            <>
              <CheckIcon size={12} /> Downloaded!
            </>
          )}
        </button>
      </div>
      {msgAllStudentsOpen && (
        <ComposeSheet
          title="Message all students"
          to={`All roster students (${roster.length})`}
          onClose={() => setMsgAllStudentsOpen(false)}
        />
      )}
    </>
  );
}
