import { CheckIcon, Loader2Icon, SendIcon, XIcon } from "lucide-react";
import { useState } from "react";

type ComposeSheetProps = {
  title: string;
  to: string;
  onClose: () => void;
};

export function ComposeSheet({ title, to, onClose }: ComposeSheetProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  function send() {
    if (state !== "idle" || !body.trim()) return;
    setState("sending");
    setTimeout(() => {
      setState("sent");
      setTimeout(() => {
        onClose();
        setState("idle");
        setSubject("");
        setBody("");
      }, 1200);
    }, 1100);
  }

  return (
    <>
      <div
        className="m-sheet-overlay"
        onClick={state === "sending" ? undefined : onClose}
      />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">{title}</span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={onClose}
            disabled={state === "sending"}
          >
            <XIcon size={15} />
          </button>
        </div>
        <div className="m-sheet__body">
          <label className="m-field">
            <span className="m-field__label">To</span>
            <input className="m-field__input m-text-2" value={to} readOnly />
          </label>
          <label className="m-field">
            <span className="m-field__label">Subject</span>
            <input
              className="m-field__input"
              placeholder="e.g. Important update about this week's session"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </label>
          <label className="m-field">
            <span className="m-field__label">Message</span>
            <textarea
              className="m-field__input m-textarea"
              rows={6}
              placeholder="Write your message here…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
        </div>
        <div className="m-sheet__foot">
          <button
            className="m-btn m-btn--ghost"
            onClick={onClose}
            disabled={state === "sending"}
          >
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            onClick={send}
            disabled={state !== "idle" || !body.trim()}
          >
            {state === "idle" && (
              <>
                <SendIcon size={13} /> Send message
              </>
            )}
            {state === "sending" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Sending…
              </>
            )}
            {state === "sent" && (
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
