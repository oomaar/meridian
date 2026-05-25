"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { computeBar } from "./helpers/computeBar";
import { fmtRange } from "./helpers/fmtRange";
import type { AdminSemesterCard } from "@/fake-db/dashboards";
import type { SemesterStatus } from "@/fake-db/types";

type NewTermSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onAdd: (card: AdminSemesterCard) => void;
};

type SaveState = "idle" | "saving" | "saved";

type Form = {
  name: string;
  code: string;
  startDate?: Date;
  endDate?: Date;
  save: SaveState;
};

const initialForm: Form = {
  name: "",
  code: "",
  startDate: undefined,
  endDate: undefined,
  save: "idle",
};

export function NewTermSheetDrawer({
  setOpen,
  onAdd,
}: NewTermSheetDrawerProps) {
  const [form, setForm] = useState<Form>(initialForm);

  function reset() {
    setForm(initialForm);
  }

  function handleClose() {
    if (form.save === "saving") return;
    setOpen(false);
    reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const startDate = form.startDate;
    const endDate = form.endDate;
    if (form.save !== "idle" || !startDate || !endDate) return;

    setForm({ ...form, save: "saving" });
    setTimeout(() => {
      setForm({ ...form, save: "saved" });

      const startIso = format(startDate, "yyyy-MM-dd");
      const endIso = format(endDate, "yyyy-MM-dd");
      const { tlLeft, tlWidth } = computeBar(startIso, endIso);

      const card: AdminSemesterCard = {
        id: `sem-${form.code.toLowerCase()}-new-${Date.now()}`,
        code: form.code,
        name: form.name,
        dateRange: fmtRange(startDate, endDate),
        status: "planning" as SemesterStatus,
        progress: 0,
        stats: { students: 0, courses: 0, instructors: 0 },
        tlLeft,
        tlWidth,
      };

      setTimeout(() => {
        onAdd(card);
        setForm({ ...form, save: "idle" });
        setOpen(false);
        reset();
      }, 800);
    }, 1300);
  }

  const canSubmit =
    form.name &&
    form.code &&
    form.startDate &&
    form.endDate &&
    form.save === "idle";

  return (
    <>
      <div className="m-sheet-overlay" onClick={handleClose} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="New term"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">New term</span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={handleClose}
          >
            <XIcon size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="m-sheet__body">
          <div className="m-fields-2">
            <label className="m-field">
              <span className="m-field__label">Term name</span>
              <input
                className="m-field__input"
                placeholder="e.g. Fall 2027"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Short code</span>
              <input
                className="m-field__input m-mono"
                placeholder="e.g. FA27"
                maxLength={6}
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                required
              />
            </label>
          </div>

          <div className="m-fields-2">
            <label className="m-field">
              <span className="m-field__label">Start date</span>
              <DatePicker
                value={form.startDate}
                onChange={(date) => setForm({ ...form, startDate: date })}
                placeholder="Pick start date"
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">End date</span>
              <DatePicker
                value={form.endDate}
                onChange={(date) => setForm({ ...form, endDate: date })}
                placeholder="Pick end date"
              />
            </label>
          </div>

          <p className="m-invite-note">
            The new term starts in <b>Planning</b> status. You can roll forward
            the course catalog once the term is created.
          </p>
        </form>

        <div className="m-sheet__foot">
          <button
            className="m-btn m-btn--ghost"
            onClick={handleClose}
            disabled={form.save === "saving"}
          >
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {form.save === "idle" && (
              <>
                <PlusIcon size={13} /> Create term
              </>
            )}
            {form.save === "saving" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Creating…
              </>
            )}
            {form.save === "saved" && (
              <>
                <CheckIcon size={13} /> Created!
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
