"use client";

import { useState } from "react";
import { CheckIcon, Loader2Icon, MegaphoneIcon, XIcon } from "lucide-react";
import type { SaveState } from "../types/SaveState";
import { CHANNELS } from "../data/CHANNELS";

export function PostAnnouncementButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState("All faculty");
  const [body, setBody] = useState("");
  const [save, setSave] = useState<SaveState>("idle");

  function reset() {
    setTitle("");
    setChannel("All faculty");
    setBody("");
    setSave("idle");
  }

  function handleClose() {
    if (save === "posting") return;
    setOpen(false);
    reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (save !== "idle" || !title || !body) return;
    setSave("posting");
    setTimeout(() => {
      setSave("posted");
      setTimeout(() => {
        setOpen(false);
        reset();
      }, 900);
    }, 1200);
  }

  const canSubmit = title.trim() && body.trim() && save === "idle";

  return (
    <>
      <button className="m-btn" onClick={() => setOpen(true)}>
        <MegaphoneIcon size={14} /> Post announcement
      </button>

      {open && (
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
              <label className="m-field">
                <span className="m-field__label">Channel</span>
                <select
                  className="m-field__input m-field__select"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                >
                  {CHANNELS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="m-field">
                <span className="m-field__label">Title</span>
                <input
                  className="m-field__input"
                  placeholder="e.g. Spring 2026 catalog window opens Nov 17"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>

              <label className="m-field">
                <span className="m-field__label">Body</span>
                <textarea
                  className="m-field__input m-field__textarea"
                  placeholder="Write your announcement here…"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  required
                />
              </label>

              <p className="m-invite-note">
                This announcement will be delivered to <b>{channel}</b> via
                in-app notification and email digest. Posts cannot be edited
                after publishing.
              </p>
            </form>

            <div className="m-sheet__foot">
              <button
                className="m-btn m-btn--ghost"
                onClick={handleClose}
                disabled={save === "posting"}
              >
                Cancel
              </button>
              <button
                className="m-btn m-btn--primary"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {save === "idle" && (
                  <>
                    <MegaphoneIcon size={13} /> Publish
                  </>
                )}
                {save === "posting" && (
                  <>
                    <Loader2Icon size={13} className="m-spin" /> Publishing…
                  </>
                )}
                {save === "posted" && (
                  <>
                    <CheckIcon size={13} /> Published!
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
