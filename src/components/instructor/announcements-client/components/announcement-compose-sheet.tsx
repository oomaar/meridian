"use client";

import type { InstructorAnnouncementItem } from "@/fake-db/dashboards";
import { CheckIcon, Loader2Icon, SendIcon, XIcon } from "lucide-react";
import { useState } from "react";

type Course = {
  id: string;
  code: string;
  title: string;
  announcements: InstructorAnnouncementItem[];
};

type FormState = "idle" | "sending" | "sent";

type Form = {
  courseId: string;
  title: string;
  body: string;
  state: FormState;
};

type AnnouncementComposeSheetProps = {
  courses: Course[];
  onPost: (item: InstructorAnnouncementItem) => void;
  onClose: () => void;
};

export function AnnouncementComposeSheet({
  courses,
  onPost,
  onClose,
}: AnnouncementComposeSheetProps) {
  const initialForm: Form = {
    courseId: courses[0]?.id ?? "",
    title: "",
    body: "",
    state: "idle",
  };
  const [form, setForm] = useState<Form>(initialForm);

  function send() {
    if (form.state !== "idle" || !form.title.trim() || !form.body.trim())
      return;
    setForm({ ...form, state: "sending" });
    setTimeout(() => {
      const course = courses.find((c) => c.id === form.courseId);
      if (course) {
        onPost({
          id: `ann-new-${Date.now()}`,
          courseCode: course.code,
          courseId: course.id,
          title: form.title.trim(),
          body: form.body.trim(),
          recipientCount:
            course.announcements.length > 0
              ? course.announcements[0].recipientCount
              : 0,
          postedLabel: "Just now",
          status: "published",
        });
      }
      setForm({ ...form, state: "sent" });
      setTimeout(() => {
        onClose();
        setForm(initialForm);
      }, 1200);
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
        aria-label="New announcement"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">New announcement</span>
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
            <span className="m-field__label">Course</span>
            <select
              className="m-field__input"
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </label>
          <label className="m-field">
            <span className="m-field__label">Subject</span>
            <input
              className="m-field__input"
              placeholder="e.g. Office hours update for this week"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="m-field">
            <span className="m-field__label">Message</span>
            <textarea
              className="m-field__input m-textarea"
              rows={6}
              placeholder="Write your announcement here…"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
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
            disabled={
              form.state !== "idle" || !form.title.trim() || !form.body.trim()
            }
          >
            {form.state === "idle" && (
              <>
                <SendIcon size={13} /> Post announcement
              </>
            )}
            {form.state === "sending" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Posting…
              </>
            )}
            {form.state === "sent" && (
              <>
                <CheckIcon size={13} /> Posted!
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
