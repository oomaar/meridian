"use client";

import {
  CheckIcon,
  ChevronDownIcon,
  Loader2Icon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import type { AdminCourseRow } from "@/fake-db/dashboards";
import { DEPARTMENT_COLORS } from "./data/DEPARTMENT_COLORS";
import { DEPARTMENTS } from "@/fake-db/lookups";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CREDITS } from "./data/CREDITS";
import { MODALITIES } from "./data/MODALITIES";
import { STATUSES } from "./data/STATUSES";

const POPOVER_CLASSES =
  "p-1 gap-0 w-(--radix-popover-trigger-width) z-[300] m-popover";

type SaveState = "idle" | "saving" | "saved";

type Form = {
  code: string;
  title: string;
  department: string;
  credits: string;
  cap: string;
  modality: string;
  status: string;
  save: SaveState;
};

const initialForm: Form = {
  code: "",
  title: "",
  department: "CS",
  credits: "3",
  cap: "30",
  modality: "In-person",
  status: "active",
  save: "idle",
};

type NewCourseSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onAdd?: (row: AdminCourseRow) => void;
};

export function NewCourseSheetDrawer({
  setOpen,
  onAdd,
}: NewCourseSheetDrawerProps) {
  const [form, setForm] = useState(initialForm);
  const [openField, setOpenField] = useState<
    "department" | "credits" | "modality" | "status" | null
  >(null);

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function pick(key: string, val: string) {
    set(key, val);
    setOpenField(null);
  }

  function toggle(
    field: "department" | "credits" | "modality" | "status",
    open: boolean,
  ) {
    setOpenField(open ? field : null);
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent,
  ) {
    e.preventDefault();
    if (form.save !== "idle" || !form.code.trim() || !form.title.trim()) return;
    setForm((f) => ({ ...f, save: "saving" }));
    setTimeout(() => {
      setForm((f) => ({ ...f, save: "saved" }));
      onAdd?.({
        id: `new-${form.code}-${Date.now()}`,
        code: form.code.trim().toUpperCase(),
        title: form.title.trim(),
        instructorName: "—",
        deptCode: form.department,
        deptColor: DEPARTMENT_COLORS[form.department] ?? "var(--m-accent)",
        modality: form.modality as AdminCourseRow["modality"],
        level: (() => {
          const n = parseInt(form.code.match(/\d+/)?.[0] ?? "100");
          return (Math.floor(Math.min(n, 500) / 100) *
            100) as AdminCourseRow["level"];
        })(),
        enrolled: 0,
        cap: parseInt(form.cap) || 30,
        credits: parseInt(form.credits) || 3,
        avgGrade: null,
        ungraded: 0,
        status: form.status as AdminCourseRow["status"],
      });
      setTimeout(() => {
        setOpen(false);
        setForm({ ...initialForm });
      }, 900);
    }, 1000);
  }

  function handleClose() {
    if (form.save === "saving") return;
    setOpen(false);
    setForm({ ...initialForm });
  }

  const selectedDept = DEPARTMENTS.find((d) => d.code === form.department);

  return (
    <>
      <div className="m-sheet-overlay" onClick={handleClose} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="New course"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">New course</span>
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
              <span className="m-field__label">Course code</span>
              <input
                className="m-field__input m-mono"
                placeholder="e.g. CS-401"
                value={form.code}
                onChange={(e) => set("code", e.target.value)}
                required
              />
            </label>
            <div className="m-field">
              <span className="m-field__label">Department</span>
              <Popover
                open={openField === "department"}
                onOpenChange={(o) => toggle("department", o)}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="m-field__input m-field__trigger"
                  >
                    <span
                      className="m-role-pill__dot"
                      style={
                        {
                          "--role-color":
                            DEPARTMENT_COLORS[form.department] ??
                            "var(--m-accent)",
                        } as React.CSSProperties
                      }
                    />
                    <span>
                      {selectedDept
                        ? `${selectedDept.code} — ${selectedDept.name}`
                        : form.department}
                    </span>
                    <ChevronDownIcon size={14} className="m-field__chevron" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={6}
                  className={`${POPOVER_CLASSES} max-h-52 overflow-y-auto`}
                >
                  {DEPARTMENTS.map((d) => (
                    <button
                      key={d.code}
                      type="button"
                      className={`m-role-option${form.department === d.code ? " m-role-option--active" : ""}`}
                      onClick={() => pick("department", d.code)}
                    >
                      <span
                        className="m-role-pill__dot"
                        style={
                          {
                            "--role-color":
                              DEPARTMENT_COLORS[d.code] ?? "var(--m-accent)",
                          } as React.CSSProperties
                        }
                      />
                      <span>
                        {d.code} — {d.name}
                      </span>
                      {form.department === d.code && (
                        <CheckIcon size={12} className="m-role-option__check" />
                      )}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <label className="m-field">
            <span className="m-field__label">Course title</span>
            <input
              className="m-field__input"
              placeholder="e.g. Advanced Distributed Systems"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </label>

          <div className="m-fields-2">
            <div className="m-field">
              <span className="m-field__label">Credits</span>
              <Popover
                open={openField === "credits"}
                onOpenChange={(o) => toggle("credits", o)}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="m-field__input m-field__trigger"
                  >
                    <span>
                      {form.credits} credit{form.credits !== "1" ? "s" : ""}
                    </span>
                    <ChevronDownIcon size={14} className="m-field__chevron" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={6}
                  className={POPOVER_CLASSES}
                >
                  {CREDITS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`m-role-option${form.credits === v ? " m-role-option--active" : ""}`}
                      onClick={() => pick("credits", v)}
                    >
                      <span>
                        {v} credit{v !== "1" ? "s" : ""}
                      </span>
                      {form.credits === v && (
                        <CheckIcon size={12} className="m-role-option__check" />
                      )}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            <label className="m-field">
              <span className="m-field__label">Enrollment cap</span>
              <input
                className="m-field__input m-mono"
                type="number"
                min={1}
                max={500}
                value={form.cap}
                onChange={(e) => set("cap", e.target.value)}
                required
              />
            </label>
          </div>

          <div className="m-fields-2">
            <div className="m-field">
              <span className="m-field__label">Modality</span>
              <Popover
                open={openField === "modality"}
                onOpenChange={(o) => toggle("modality", o)}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="m-field__input m-field__trigger"
                  >
                    <span>{form.modality}</span>
                    <ChevronDownIcon size={14} className="m-field__chevron" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={6}
                  className={POPOVER_CLASSES}
                >
                  {MODALITIES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`m-role-option${form.modality === m ? " m-role-option--active" : ""}`}
                      onClick={() => pick("modality", m)}
                    >
                      <span>{m}</span>
                      {form.modality === m && (
                        <CheckIcon size={12} className="m-role-option__check" />
                      )}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            <div className="m-field">
              <span className="m-field__label">Status</span>
              <Popover
                open={openField === "status"}
                onOpenChange={(o) => toggle("status", o)}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="m-field__input m-field__trigger"
                  >
                    <span>
                      {STATUSES.find((s) => s.value === form.status)?.label ??
                        form.status}
                    </span>
                    <ChevronDownIcon size={14} className="m-field__chevron" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={6}
                  className={POPOVER_CLASSES}
                >
                  {STATUSES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      className={`m-role-option${form.status === s.value ? " m-role-option--active" : ""}`}
                      onClick={() => pick("status", s.value)}
                    >
                      <span>{s.label}</span>
                      {form.status === s.value && (
                        <CheckIcon size={12} className="m-role-option__check" />
                      )}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
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
            disabled={
              form.save !== "idle" || !form.code.trim() || !form.title.trim()
            }
            onClick={handleSubmit}
          >
            {form.save === "idle" && (
              <>
                <PlusIcon size={13} /> Create course
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
