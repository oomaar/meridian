"use client";

import type { StudentCourseDetailLesson } from "@/fake-db/dashboards";
import { CheckIcon, ClipboardListIcon, XIcon } from "lucide-react";
import { useState } from "react";

type QuizStageProps = { lesson: StudentCourseDetailLesson };

export function QuizStage({ lesson }: QuizStageProps) {
  const questions = lesson.quizQuestions ?? [];

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(lesson.state === "complete");

  const answeredCount = Object.keys(answers).length;
  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.correctIdx).length
    : null;

  function optionClass(qi: number, oi: number) {
    let cls = "m-quiz-option";
    if (!submitted && answers[qi] === oi) cls += " m-quiz-option--selected";
    if (submitted && oi === questions[qi].correctIdx)
      cls += " m-quiz-option--correct";
    if (submitted && answers[qi] === oi && oi !== questions[qi].correctIdx)
      cls += " m-quiz-option--wrong";
    return cls;
  }

  return (
    <div className="m-quiz-stage">
      <div className="m-quiz-stage__header">
        <span className="m-quiz-stage__title">
          <ClipboardListIcon
            size={13}
            style={{ verticalAlign: -2, marginRight: 6 }}
          />
          Quiz · {questions.length} questions
        </span>
        {submitted && score !== null ? (
          <span
            className={`m-badge m-badge--${score >= questions.length * 0.7 ? "success" : "warning"}`}
          >
            {score}/{questions.length} correct
          </span>
        ) : (
          <span
            className="m-mono"
            style={{ fontSize: 11.5, color: "var(--m-text-3)" }}
          >
            {answeredCount}/{questions.length} answered
          </span>
        )}
      </div>

      <div className="m-quiz-stage__body">
        {questions.map((q, qi) => (
          <div key={qi}>
            <div className="m-quiz-question__stem">
              {qi + 1}. {q.stem}
            </div>
            <div className="m-quiz-question__options">
              {q.options.map((opt, oi) => (
                <div
                  key={oi}
                  className={optionClass(qi, oi)}
                  onClick={() => {
                    if (!submitted) setAnswers((a) => ({ ...a, [qi]: oi }));
                  }}
                >
                  <div className="m-quiz-radio">
                    {(answers[qi] === oi ||
                      (submitted && oi === q.correctIdx)) && (
                      <div className="m-quiz-radio__dot" />
                    )}
                  </div>
                  {opt}
                  {submitted && oi === q.correctIdx && (
                    <CheckIcon
                      size={13}
                      style={{ marginLeft: "auto", color: "var(--m-success)" }}
                    />
                  )}
                  {submitted && answers[qi] === oi && oi !== q.correctIdx && (
                    <XIcon
                      size={13}
                      style={{
                        marginLeft: "auto",
                        color: "var(--m-danger, #e05252)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="m-quiz-stage__footer">
        {submitted ? (
          <button
            className="m-btn m-btn--ghost m-btn--sm"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            Retake quiz
          </button>
        ) : (
          <span style={{ fontSize: 12, color: "var(--m-text-3)" }}>
            Select an answer for each question
          </span>
        )}
        {!submitted && (
          <button
            className="m-btn m-btn--primary m-btn--sm"
            disabled={answeredCount < questions.length}
            onClick={() => setSubmitted(true)}
          >
            <CheckIcon size={13} /> Submit quiz
          </button>
        )}
      </div>
    </div>
  );
}
