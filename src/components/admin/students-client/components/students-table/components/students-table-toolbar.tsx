import {
  CheckIcon,
  DownloadIcon,
  InboxIcon,
  Loader2Icon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { FilterMenu } from "./filter-menu";
import { STANDING_OPTIONS } from "../data/STANDING_OPTIONS";
import { Dispatch, SetStateAction } from "react";
import { AdminStudentRow } from "@/fake-db/dashboards";

type StudentsTableToolbarProps = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  someChecked: boolean;
  handleExport(): void;
  handleRemoveConfirmed(): void;
  reset: (setter: (v: string) => void) => (v: string) => void;
  confirmRemove: boolean;
  setConfirmRemove: Dispatch<SetStateAction<boolean>>;
  standing: string;
  setStanding: Dispatch<SetStateAction<string>>;
  program: string;
  setProgram: Dispatch<SetStateAction<string>>;
  selected: Set<string>;
  rows: AdminStudentRow[];
  setMsgOpen: Dispatch<SetStateAction<boolean>>;
  activeTab: "roster" | "advisees" | "holds";
  setActiveTab: Dispatch<SetStateAction<"roster" | "advisees" | "holds">>;
  exportState: "idle" | "exporting" | "done";
};

export function StudentsTableToolbar({
  confirmRemove,
  setConfirmRemove,
  handleExport,
  handleRemoveConfirmed,
  reset,
  searchQuery,
  setSearchQuery,
  someChecked,
  standing,
  setStanding,
  program,
  setProgram,
  selected,
  rows,
  setMsgOpen,
  activeTab,
  setActiveTab,
  exportState,
}: StudentsTableToolbarProps) {
  const programOptions = Array.from(
    new Map(rows.map((r) => [r.programCode, r.programName])),
  )
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([code, name]) => ({ value: code, label: name }));

  return (
    <div className="m-card__toolbar">
      <div className="m-search" style={{ maxWidth: 320 }}>
        <SearchIcon className="m-search__icon" size={14} />
        <input
          value={searchQuery}
          onChange={(e) => reset(setSearchQuery)(e.target.value)}
          placeholder="Search name, ID, email…"
        />
      </div>
      <FilterMenu
        label="Program"
        value={program}
        options={programOptions}
        onChange={reset(setProgram)}
      />
      <FilterMenu
        label="Standing"
        value={standing}
        options={STANDING_OPTIONS}
        onChange={reset(setStanding)}
      />
      <div className="m-spacer" />

      {someChecked ? (
        confirmRemove ? (
          /* ── confirm remove bar ── */
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
        ) : (
          /* ── bulk action bar ── */
          <div className="m-bulk-bar">
            <span className="m-bulk-bar__count">{selected.size} selected</span>
            <button
              className="m-btn m-btn--sm"
              onClick={() => setMsgOpen(true)}
            >
              <InboxIcon size={12} /> Message
            </button>
            <button
              className="m-btn m-btn--sm"
              disabled={exportState !== "idle"}
              onClick={handleExport}
            >
              {exportState === "idle" && (
                <>
                  <DownloadIcon size={12} /> Export
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
            <button
              className="m-btn m-btn--sm m-btn--danger"
              onClick={() => setConfirmRemove(true)}
            >
              <Trash2Icon size={12} /> Remove
            </button>
          </div>
        )
      ) : (
        <div className="m-seg">
          <button
            aria-pressed={activeTab === "roster"}
            onClick={() => setActiveTab("roster")}
          >
            Roster
          </button>
          <button
            aria-pressed={activeTab === "advisees"}
            onClick={() => setActiveTab("advisees")}
          >
            Advisees
          </button>
          <button
            aria-pressed={activeTab === "holds"}
            onClick={() => setActiveTab("holds")}
          >
            Holds
          </button>
        </div>
      )}
    </div>
  );
}
