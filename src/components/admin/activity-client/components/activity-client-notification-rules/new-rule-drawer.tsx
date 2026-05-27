"use client";

import { FormEvent, useState } from "react";
import { CheckIcon, ChevronDownIcon, XIcon, ZapIcon } from "lucide-react";
import { TRIGGERS } from "./data/TRIGGERS";
import { NOTIFY_TARGETS } from "./data/NOTIFY_TARGETS";
import { CHANNELS } from "./data/CHANNELS";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Form = {
  name: string;
  trigger: string;
  notify: string;
  channel: string;
};

const initialForm: Form = {
  name: "",
  trigger: TRIGGERS[0],
  notify: NOTIFY_TARGETS[0],
  channel: CHANNELS[2],
};

type NewRuleDrawerProps = {
  onClose: () => void;
  onSave: (label: string) => void;
};

const POPOVER_CLASSES =
  "p-1 gap-0 w-(--radix-popover-trigger-width) z-[300] bg-m-surface text-m-text border-m-line";

export function NewRuleDrawer({ onClose, onSave }: NewRuleDrawerProps) {
  const [form, setForm] = useState<Form>(initialForm);
  const [openField, setOpenField] = useState<
    "trigger" | "notify" | "channel" | null
  >(null);

  function toggle(field: "trigger" | "notify" | "channel", open: boolean) {
    setOpenField(open ? field : null);
  }

  function pick(field: keyof Form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setOpenField(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(`${form.name.trim()} — ${form.channel} · ${form.notify}`);
    onClose();
  }

  function renderDropdown(
    field: "trigger" | "notify" | "channel",
    label: string,
    options: string[],
  ) {
    const value = form[field];
    return (
      <div className="m-field">
        <span className="m-field__label">{label}</span>
        <Popover
          open={openField === field}
          onOpenChange={(o) => toggle(field, o)}
        >
          <PopoverTrigger asChild>
            <button type="button" className="m-field__input m-field__trigger">
              <span>{value}</span>
              <ChevronDownIcon size={14} className="m-field__chevron" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={6}
            className={POPOVER_CLASSES}
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`m-role-option${value === opt ? " m-role-option--active" : ""}`}
                onClick={() => pick(field, opt)}
              >
                <span>{opt}</span>
                {value === opt && (
                  <CheckIcon size={12} className="m-role-option__check" />
                )}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <>
      <div className="m-sheet-overlay" onClick={onClose} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="New notification rule"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">New notification rule</span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={onClose}
          >
            <XIcon size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="m-sheet__body">
          <label className="m-field">
            <span className="m-field__label">Rule name</span>
            <input
              className="m-field__input"
              placeholder="e.g. Alert Dean on SLA breach"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          {renderDropdown("trigger", "Trigger event", TRIGGERS)}
          {renderDropdown("notify", "Notify", NOTIFY_TARGETS)}
          {renderDropdown("channel", "Channel", CHANNELS)}
          <p className="m-invite-note">
            This rule will fire whenever <b>{form.trigger.toLowerCase()}</b> is
            detected and will notify <b>{form.notify}</b> via{" "}
            <b>{form.channel.toLowerCase()}</b>. Rules can be paused or deleted
            at any time.
          </p>
        </form>
        <div className="m-sheet__foot">
          <button className="m-btn m-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={!form.name.trim()}
            onClick={handleSubmit}
          >
            <ZapIcon size={13} /> Save rule
          </button>
        </div>
      </div>
    </>
  );
}
