"use client";

import { CheckIcon, ChevronDownIcon, Loader2Icon, SendIcon, XIcon } from "lucide-react";
import { DEPARTMENTS } from "./data/DEPARTMENTS";
import { TITLES } from "./data/TITLES";
import { Dispatch, SetStateAction, useState } from "react";
import { deriveEmail } from "./helpers/deriveEmail";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import type { InstructorTitle } from "@/fake-db";
import { DEPTARTMENT_COLORS } from "./data/DEPTARTMENT_COLORS";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const POPOVER_CLASSES =
  "p-1 gap-0 w-(--radix-popover-trigger-width) z-[300] m-popover max-h-52 overflow-y-auto";

type InviteInstructorSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onAdd?: (row: AdminInstructorRow) => void;
};

type SaveState = "idle" | "sending" | "sent";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
  emailTouched: boolean;
  save: SaveState;
};

const initialForm: Form = {
  firstName: "",
  lastName: "",
  email: "",
  department: "CS",
  title: "Assistant Professor",
  emailTouched: false,
  save: "idle",
};

export function InviteInstructorSheetDrawer({
  setOpen,
  onAdd,
}: InviteInstructorSheetDrawerProps) {
  const [form, setForm] = useState<Form>(initialForm);
  const [openField, setOpenField] = useState<"department" | "title" | null>(
    null,
  );

  function set(key: string, val: string) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if ((key === "firstName" || key === "lastName") && !form.emailTouched) {
        next.email = deriveEmail(
          key === "firstName" ? val : f.firstName,
          key === "lastName" ? val : f.lastName,
        );
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.save !== "idle") return;

    setForm((f) => ({ ...f, save: "sending" }));
    setTimeout(() => {
      setForm((f) => ({ ...f, save: "sent" }));
      const dept = DEPARTMENTS.find((d) => d.code === form.department);
      onAdd?.({
        id: `new-${Date.now()}`,
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        title: form.title as InstructorTitle,
        deptCode: form.department,
        deptName: dept?.name ?? form.department,
        deptColor: DEPTARTMENT_COLORS[form.department] ?? "var(--m-accent)",
        status: "active",
        rating: 0,
        courseCount: 0,
        activeCourseCount: 0,
        hireDate: String(new Date().getFullYear()),
      });
      setTimeout(() => {
        setForm(initialForm);
      }, 1000);
    }, 1400);
  }

  function handleClose() {
    if (form.save === "sending") return;
    setForm(initialForm);
    setOpen(false);
  }

  return (
    <>
      <div className="m-sheet-overlay" onClick={handleClose} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Invite instructor"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">Invite instructor</span>
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
                placeholder="e.g. Linnea"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                required
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Last name</span>
              <input
                className="m-field__input"
                placeholder="e.g. Ahmadi"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
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
                const emailVal = e.target.value;
                setForm((f) => ({ ...f, emailTouched: true, email: emailVal }));
              }}
              required
            />
          </label>

          <div className="m-fields-2">
            <div className="m-field">
              <span className="m-field__label">Department</span>
              <Popover
                open={openField === "department"}
                onOpenChange={(o) => setOpenField(o ? "department" : null)}
              >
                <PopoverTrigger asChild>
                  <button type="button" className="m-field__input m-field__trigger">
                    <span
                      className="m-role-pill__dot"
                      style={{ "--role-color": DEPTARTMENT_COLORS[form.department] ?? "var(--m-accent)" } as React.CSSProperties}
                    />
                    <span>
                      {(() => {
                        const d = DEPARTMENTS.find((d) => d.code === form.department);
                        return d ? `${d.code} — ${d.name}` : form.department;
                      })()}
                    </span>
                    <ChevronDownIcon size={14} className="m-field__chevron" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={6}
                  className={POPOVER_CLASSES}
                >
                  {DEPARTMENTS.map((d) => (
                    <button
                      key={d.code}
                      type="button"
                      className={`m-role-option${form.department === d.code ? " m-role-option--active" : ""}`}
                      onClick={() => {
                        set("department", d.code);
                        setOpenField(null);
                      }}
                    >
                      <span
                        className="m-role-pill__dot"
                        style={{ "--role-color": DEPTARTMENT_COLORS[d.code] ?? "var(--m-accent)" } as React.CSSProperties}
                      />
                      <span>{d.code} — {d.name}</span>
                      {form.department === d.code && (
                        <CheckIcon size={12} className="m-role-option__check" />
                      )}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            <div className="m-field">
              <span className="m-field__label">Rank</span>
              <Popover
                open={openField === "title"}
                onOpenChange={(o) => setOpenField(o ? "title" : null)}
              >
                <PopoverTrigger asChild>
                  <button type="button" className="m-field__input m-field__trigger">
                    <span>{form.title}</span>
                    <ChevronDownIcon size={14} className="m-field__chevron" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" sideOffset={6} className={POPOVER_CLASSES}>
                  {TITLES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`m-role-option${form.title === t ? " m-role-option--active" : ""}`}
                      onClick={() => {
                        set("title", t);
                        setOpenField(null);
                      }}
                    >
                      <span>{t}</span>
                      {form.title === t && (
                        <CheckIcon size={12} className="m-role-option__check" />
                      )}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <p className="m-invite-note">
            An invitation email will be sent to the address above. The
            instructor can set their password and complete their profile before
            their first semester.
          </p>
        </form>

        <div className="m-sheet__foot">
          <button
            className="m-btn m-btn--ghost"
            onClick={handleClose}
            disabled={form.save === "sending"}
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
                <SendIcon size={13} /> Send invite
              </>
            )}
            {form.save === "sending" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Sending…
              </>
            )}
            {form.save === "sent" && (
              <>
                <CheckIcon size={13} /> Sent!
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
