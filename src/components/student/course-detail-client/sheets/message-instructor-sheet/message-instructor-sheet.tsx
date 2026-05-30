"use client";

import { CheckIcon, SendIcon, XIcon } from "lucide-react";
import { useState } from "react";

type MessageInstructorSheetProps = {
  instructor: string;
  courseCode: string;
  onClose: () => void;
};

export function MessageInstructorSheet({
  instructor,
  courseCode,
  onClose,
}: MessageInstructorSheetProps) {
  const [subject, setSubject] = useState(`[${courseCode}] `);
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <>
      <div className="m-sheet-overlay" onClick={onClose} />
      <div className="m-sheet">
        <div className="m-sheet__head">
          <span className="m-sheet__title">Message instructor</span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={onClose}
          >
            <XIcon size={14} />
          </button>
        </div>

        <div className="m-sheet__body">
          <div className="m-msg-field">
            <div className="m-msg-field__label">To</div>
            <div className="m-msg-field__readonly">{instructor}</div>
          </div>

          <div className="m-msg-field">
            <div className="m-msg-field__label">Subject</div>
            <input
              className="m-msg-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={`[${courseCode}] Your subject…`}
            />
          </div>

          <div className="m-msg-field">
            <div className="m-msg-field__label">Message</div>
            <textarea
              className="m-assignment-textarea m-msg-textarea"
              placeholder="Write your message…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          {sent && (
            <div className="m-assignment-submitted">
              <CheckIcon size={13} />
              Message sent to {instructor}
            </div>
          )}
        </div>

        <div className="m-sheet__foot">
          <button className="m-btn m-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={
              body.trim().length < 5 || subject.trim().length < 3 || sent
            }
            onClick={() => {
              setSent(true);
              setBody("");
              setSubject(`[${courseCode}] `);
              setTimeout(() => setSent(false), 2500);
            }}
          >
            <SendIcon size={13} /> Send message
          </button>
        </div>
      </div>
    </>
  );
}
