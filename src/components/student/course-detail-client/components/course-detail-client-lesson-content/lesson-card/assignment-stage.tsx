"use client";

import type { StudentCourseDetailLesson } from "@/fake-db/dashboards";
import { CheckIcon, SendIcon } from "lucide-react";
import { useState } from "react";

type AssignmentStageProps = { lesson: StudentCourseDetailLesson };

export function AssignmentStage({ lesson }: AssignmentStageProps) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(lesson.state === "complete");

  return (
    <div className="m-assignment-stage">
      <div className="m-assignment-brief">
        <div className="m-assignment-brief__label">Assignment brief</div>
        <p className="m-assignment-brief__desc">{lesson.description}</p>
        <div className="m-assignment-reqs">
          {lesson.objectives.map((req, i) => (
            <div key={i} className="m-assignment-req">
              <span className="m-assignment-req__bullet">→</span>
              {req}
            </div>
          ))}
        </div>
      </div>
      <div className="m-assignment-submit">
        <div className="m-assignment-submit__label">Your submission</div>
        {submitted ? (
          <div className="m-assignment-submitted">
            <CheckIcon size={13} />
            Submitted successfully
          </div>
        ) : (
          <textarea
            className="m-assignment-textarea"
            placeholder="Write your response here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
        <div className="m-assignment-submit__footer">
          <span className="m-assignment-submit__hint">
            {submitted
              ? "You can resubmit until the deadline"
              : `${text.length} chars`}
          </span>
          {submitted ? (
            <button
              className="m-btn m-btn--ghost m-btn--sm"
              onClick={() => {
                setText("");
                setSubmitted(false);
              }}
            >
              Edit submission
            </button>
          ) : (
            <button
              className="m-btn m-btn--primary m-btn--sm"
              disabled={text.trim().length < 10}
              onClick={() => setSubmitted(true)}
            >
              <SendIcon size={12} /> Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
