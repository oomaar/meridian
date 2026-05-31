"use client";

import { CheckIcon, SendIcon, XIcon } from "lucide-react";
import { useState } from "react";

type Form = {
  subject: string;
  body: string;
  sent: boolean;
};

type MessageInstructorSheetBodyProps = {
  instructor: string;
  courseCode: string;
  onClose: () => void;
};

export function MessageInstructorSheetBody({
  courseCode,
  instructor,
  onClose,
}: MessageInstructorSheetBodyProps) {
  const initialFormState: Form = {
    subject: `[${courseCode}] `,
    body: "",
    sent: false,
  };

  const [form, setForm] = useState<Form>(initialFormState);

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
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder={`[${courseCode}] Your subject…`}
            />
          </div>

          <div className="m-msg-field">
            <div className="m-msg-field__label">Message</div>
            <textarea
              className="m-assignment-textarea m-msg-textarea"
              placeholder="Write your message…"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </div>

          {form.sent && (
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
              form.body.trim().length < 5 ||
              form.subject.trim().length < 3 ||
              form.sent
            }
            onClick={() => {
              setForm({
                ...form,
                sent: true,
                body: "",
                subject: `[${courseCode}] `,
              });
              setTimeout(() => setForm(initialFormState), 2500);
            }}
          >
            <SendIcon size={13} /> Send message
          </button>
        </div>
      </div>
    </>
  );
}
