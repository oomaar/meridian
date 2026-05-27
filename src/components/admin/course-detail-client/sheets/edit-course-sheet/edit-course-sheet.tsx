"use client";

import {
  CheckIcon,
  ChevronDownIcon,
  Loader2Icon,
  PenIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
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

type EditCourseSheetProps = {
  course: {
    title: string;
    credits: number;
    modality: string;
    cap: number;
    status: string;
  };
  onClose: () => void;
};

export function EditCourseSheet({ course, onClose }: EditCourseSheetProps) {
  const [form, setForm] = useState({
    title: course.title,
    credits: String(course.credits),
    modality: course.modality,
    cap: String(course.cap),
    status: course.status,
  });

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const [openField, setOpenField] = useState<
    "credits" | "modality" | "status" | null
  >(null);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function pick(k: string, v: string) {
    set(k, v);
    setOpenField(null);
  }

  function toggle(field: "credits" | "modality" | "status", open: boolean) {
    setOpenField(open ? field : null);
  }

  function save() {
    if (saveState !== "idle") return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => {
        onClose();
        setSaveState("idle");
      }, 1000);
    }, 1100);
  }

  return (
    <>
      <div
        className="m-sheet-overlay"
        onClick={saveState === "saving" ? undefined : onClose}
      />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Edit course"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">Edit course</span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={onClose}
            disabled={saveState === "saving"}
          >
            <XIcon size={15} />
          </button>
        </div>
        <form
          className="m-sheet__body"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <label className="m-field">
            <span className="m-field__label">Course title</span>
            <input
              className="m-field__input"
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
            onClick={onClose}
            disabled={saveState === "saving"}
          >
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            onClick={save}
            disabled={saveState !== "idle" || !form.title.trim()}
          >
            {saveState === "idle" && (
              <>
                <PenIcon size={13} /> Save changes
              </>
            )}
            {saveState === "saving" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Saving…
              </>
            )}
            {saveState === "saved" && (
              <>
                <CheckIcon size={13} /> Saved!
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
