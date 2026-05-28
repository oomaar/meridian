"use client";

import type { AdminStudentRow } from "@/fake-db/dashboards";
import {
  CheckIcon,
  ChevronDownIcon,
  Loader2Icon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import type { StudentStatus } from "@/fake-db";
import { PROGRAMS } from "@/fake-db/lookups";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { STANDINGS } from "./data/STANDINGS";
import { STATUSES } from "./data/STATUSES";

const POPOVER_CLASSES =
  "p-1 gap-0 w-(--radix-popover-trigger-width) z-[300] m-popover max-h-52 overflow-y-auto";

type SaveState = "idle" | "saving" | "saved";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  standing: string;
  status: string;
  emailTouched: boolean;
  save: SaveState;
};

const initialForm: Form = {
  firstName: "",
  lastName: "",
  email: "",
  program: "CS-BS",
  standing: "Freshman",
  status: "active",
  emailTouched: false,
  save: "idle",
};

type AddStudentSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onAdd?: (row: AdminStudentRow) => void;
};

export function AddStudentSheetDrawer({
  setOpen,
  onAdd,
}: AddStudentSheetDrawerProps) {
  const [form, setForm] = useState<Form>(initialForm);
  const [openField, setOpenField] = useState<
    "program" | "standing" | "status" | null
  >(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.save !== "idle") return;
    setForm((f) => ({ ...f, save: "saving" }));
    setTimeout(() => {
      setForm((f) => ({ ...f, save: "saved" }));
      const prog = PROGRAMS.find((p) => p.code === form.program);
      onAdd?.({
        id: `new-${Date.now()}`,
        studentNumber: `STU-${String(Date.now()).slice(-6)}`,
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        programName: prog?.name ?? form.program,
        programCode: form.program,
        standing: form.standing,
        gpa: 0.0,
        credits: 0,
        status: form.status as StudentStatus,
        advisorName: "Unassigned",
        lastActive: "just now",
        isAdvisee: false,
      });
      setTimeout(() => {
        setForm(initialForm);
      }, 900);
    }, 1400);
  }

  function handleClose() {
    if (form.save === "saving") return;
    setOpen(false);
    setForm(initialForm);
  }

  return (
    <>
      <div className="m-sheet-overlay" onClick={handleClose} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Add student"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">Add student</span>
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
              <span className="m-field__label">First name</span>
              <input
                className="m-field__input"
                placeholder="e.g. Mei Lin"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
                required
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Last name</span>
              <input
                className="m-field__input"
                placeholder="e.g. Chen"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
                required
              />
            </label>
          </div>

          <label className="m-field">
            <span className="m-field__label">University email</span>
            <input
              className="m-field__input m-mono"
              placeholder="firstname.lastname@aldridge.edu"
              value={form.email}
              onChange={(e) => {
                setForm((f) => ({
                  ...f,
                  email: e.target.value,
                  emailTouched: true,
                }));
              }}
              required
            />
          </label>

          <div className="m-field">
            <span className="m-field__label">Program</span>
            <Popover
              open={openField === "program"}
              onOpenChange={(o) => setOpenField(o ? "program" : null)}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="m-field__input m-field__trigger"
                >
                  <span>
                    {PROGRAMS.find((p) => p.code === form.program)?.name ??
                      form.program}
                  </span>
                  <ChevronDownIcon size={14} className="m-field__chevron" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={6}
                className={POPOVER_CLASSES}
              >
                {PROGRAMS.map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    className={`m-role-option${form.program === p.code ? " m-role-option--active" : ""}`}
                    onClick={() => {
                      setForm((f) => ({ ...f, program: p.code }));
                      setOpenField(null);
                    }}
                  >
                    <span>{p.name}</span>
                    {form.program === p.code && (
                      <CheckIcon size={12} className="m-role-option__check" />
                    )}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <div className="m-fields-2">
            <div className="m-field">
              <span className="m-field__label">Standing</span>
              <Popover
                open={openField === "standing"}
                onOpenChange={(o) => setOpenField(o ? "standing" : null)}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="m-field__input m-field__trigger"
                  >
                    <span>{form.standing}</span>
                    <ChevronDownIcon size={14} className="m-field__chevron" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={6}
                  className={POPOVER_CLASSES}
                >
                  {STANDINGS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`m-role-option${form.standing === s ? " m-role-option--active" : ""}`}
                      onClick={() => {
                        setForm((f) => ({ ...f, standing: s }));
                        setOpenField(null);
                      }}
                    >
                      <span>{s}</span>
                      {form.standing === s && (
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
                onOpenChange={(o) => setOpenField(o ? "status" : null)}
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
                      onClick={() => {
                        setForm((f) => ({ ...f, status: s.value }));
                        setOpenField(null);
                      }}
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
            disabled={form.save !== "idle"}
            onClick={handleSubmit}
          >
            {form.save === "idle" && (
              <>
                <PlusIcon size={13} /> Add student
              </>
            )}
            {form.save === "saving" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Adding…
              </>
            )}
            {form.save === "saved" && (
              <>
                <CheckIcon size={13} /> Added!
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
