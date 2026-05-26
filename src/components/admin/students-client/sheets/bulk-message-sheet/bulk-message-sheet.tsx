import { CheckIcon, Loader2Icon, SendIcon, XIcon } from "lucide-react";
import { useState } from "react";

type BulkMessageSheetProps = {
  count: number;
  onClose: () => void;
};

type FormState = "idle" | "sending" | "sent";

type Form = {
  subject: string;
  body: string;
  state: FormState;
};

const initialForm: Form = {
  subject: "",
  body: "",
  state: "idle",
};

export function BulkMessageSheet({ count, onClose }: BulkMessageSheetProps) {
  const [form, setForm] = useState<Form>(initialForm);

  function send() {
    if (form.state !== "idle" || !form.body.trim()) return;
    setForm((prev) => ({ ...prev, state: "sending" }));
    setTimeout(() => {
      setForm((prev) => ({ ...prev, state: "sent" }));
      setTimeout(() => {
        onClose();
      }, 1100);
    }, 1100);
  }

  return (
    <>
      <div
        className="m-sheet-overlay"
        onClick={form.state === "sending" ? undefined : onClose}
      />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Message students"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">Message students</span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={onClose}
            disabled={form.state === "sending"}
          >
            <XIcon size={15} />
          </button>
        </div>
        <div className="m-sheet__body">
          <label className="m-field">
            <span className="m-field__label">To</span>
            <input
              className="m-field__input m-text-2"
              readOnly
              value={`${count} selected student${count !== 1 ? "s" : ""}`}
            />
          </label>
          <label className="m-field">
            <span className="m-field__label">Subject</span>
            <input
              className="m-field__input"
              placeholder="e.g. Reminder: office hours this week"
              value={form.subject}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, subject: e.target.value }))
              }
            />
          </label>
          <label className="m-field">
            <span className="m-field__label">Message</span>
            <textarea
              className="m-field__input m-textarea"
              rows={6}
              placeholder="Write your message here…"
              value={form.body}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, body: e.target.value }))
              }
            />
          </label>
        </div>
        <div className="m-sheet__foot">
          <button
            className="m-btn m-btn--ghost"
            onClick={onClose}
            disabled={form.state === "sending"}
          >
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            onClick={send}
            disabled={form.state !== "idle" || !form.body.trim()}
          >
            {form.state === "idle" && (
              <>
                <SendIcon size={13} /> Send message
              </>
            )}
            {form.state === "sending" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Sending…
              </>
            )}
            {form.state === "sent" && (
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
