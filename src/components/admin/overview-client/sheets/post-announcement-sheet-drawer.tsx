"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  Loader2Icon,
  MegaphoneIcon,
  XIcon,
} from "lucide-react";
import { CHANNELS } from "../data/CHANNELS";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const POPOVER_CLASSES =
  "p-1 gap-0 w-(--radix-popover-trigger-width) z-[300] m-popover max-h-52 overflow-y-auto";

type SaveState = "idle" | "posting" | "posted";

type Form = {
  title: string;
  channel: string;
  body: string;
  save: SaveState;
};

const intialForm: Form = {
  title: "",
  channel: "All faculty",
  body: "",
  save: "idle",
};

type PostAnnouncementSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function PostAnnouncementSheetDrawer({
  setOpen,
}: PostAnnouncementSheetDrawerProps) {
  const [form, setForm] = useState<Form>(intialForm);
  const [channelOpen, setChannelOpen] = useState(false);

  function reset() {
    setForm(intialForm);
  }

  function handleClose() {
    if (form.save === "posting") return;
    setOpen(false);
    reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.save !== "idle" || !form.title || !form.body) return;
    setForm({ ...form, save: "posting" });
    setTimeout(() => {
      setForm({ ...form, save: "posted" });
      setTimeout(() => {
        setOpen(false);
        reset();
      }, 900);
    }, 1200);
  }

  const canSubmit =
    form.title.trim() && form.body.trim() && form.save === "idle";

  return (
    <>
      <div className="m-sheet-overlay" onClick={handleClose} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Post announcement"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">Post announcement</span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={handleClose}
          >
            <XIcon size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="m-sheet__body">
          <div className="m-field">
            <span className="m-field__label">Channel</span>
            <Popover open={channelOpen} onOpenChange={setChannelOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="m-field__input m-field__trigger"
                >
                  <span>{form.channel}</span>
                  <ChevronDownIcon size={14} className="m-field__chevron" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={6}
                className={POPOVER_CLASSES}
              >
                {CHANNELS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`m-role-option${form.channel === c ? " m-role-option--active" : ""}`}
                    onClick={() => {
                      setForm({ ...form, channel: c });
                      setChannelOpen(false);
                    }}
                  >
                    <span>{c}</span>
                    {form.channel === c && (
                      <CheckIcon size={12} className="m-role-option__check" />
                    )}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <label className="m-field">
            <span className="m-field__label">Title</span>
            <input
              className="m-field__input"
              placeholder="e.g. Spring 2026 catalog window opens Nov 17"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label className="m-field">
            <span className="m-field__label">Body</span>
            <textarea
              className="m-field__input m-field__textarea"
              placeholder="Write your announcement here…"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={6}
              required
            />
          </label>

          <p className="m-invite-note">
            This announcement will be delivered to <b>{form.channel}</b> via
            in-app notification and email digest. Posts cannot be edited after
            publishing.
          </p>
        </form>

        <div className="m-sheet__foot">
          <button
            className="m-btn m-btn--ghost"
            onClick={handleClose}
            disabled={form.save === "posting"}
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
                <MegaphoneIcon size={13} /> Publish
              </>
            )}
            {form.save === "posting" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Publishing…
              </>
            )}
            {form.save === "posted" && (
              <>
                <CheckIcon size={13} /> Published!
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
