import { Check } from "lucide-react";
import { generateSampleSubmission } from "@/fake-db";
import { PERSONAS } from "@/lib/personas";

const RUBRIC = [
  { k: "Election", v: 23, m: 25 },
  { k: "Replication", v: 25, m: 30 },
  { k: "Partitions", v: 18, m: 20 },
  { k: "Quality", v: 13, m: 15 },
  { k: "Writeup", v: 7, m: 10 },
];

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function submissionIdFor(studentId: string): string {
  // "stu-08723" → "S-8723"
  const numeric = studentId.split("-")[1] ?? studentId;
  return `S-${numeric.replace(/^0+/, "") || "0"}`;
}

const FALLBACK = {
  studentName: "Aarav Patel",
  initials: "AP",
  submissionId: "S-9821",
};

export function MiniGradingPreview() {
  const sample = generateSampleSubmission(PERSONAS.instructor.fakeDbId);
  const studentName = sample?.student.fullName ?? FALLBACK.studentName;
  const initials = sample
    ? initialsOf(sample.student.fullName)
    : FALLBACK.initials;
  const submissionId = sample
    ? submissionIdFor(sample.student.id)
    : FALLBACK.submissionId;

  return (
    <div className="m-mini-grading">
      <div>
        <div className="m-mini-grading__submission-head">
          <div className="m-mini-grading__avatar">{initials}</div>
          <div>
            <div className="m-mini-grading__student-name">{studentName}</div>
            <div className="m-mini-grading__submission-meta">
              {submissionId} · attempt 1 · 2m ago
            </div>
          </div>
          <span className="m-mini-grading__autograder-pill">
            <Check size={9} /> 14/16
          </span>
        </div>

        <div className="m-mini-grading__code">
          <span className="m-mini-grading__code-kw">def</span>{" "}
          <span className="m-mini-grading__code-fn">append_entries</span>(
          <span className="m-mini-grading__code-kw">
            self, term, leader_id, prev_idx
          </span>
          ):
          <br />
          {"  "}
          <span className="m-mini-grading__code-kw">if</span> term &lt;
          self.current_term:
          <br />
          {"    "}
          <span className="m-mini-grading__code-kw">return</span>{" "}
          AppendResult(self.current_term, success=
          <span className="m-mini-grading__code-false">False</span>)
          <br />
          <br />
          {"  "}self._reset_election_timer()
          <br />
          {"  "}self.log = self.log[:prev_idx + 1] + list(entries)
          <br />
          <br />
          <span className="m-mini-grading__code-kw">...</span>
        </div>

        <div className="m-mini-grading__inline-comment">
          <b>Inline · line 6 ·</b>{" "}
          <span>You truncate before checking — what if entries is empty?</span>
        </div>
      </div>

      <div className="m-mini-grading__rubric">
        <div className="m-mini-grading__rubric-label">Rubric · 100 pts</div>
        {RUBRIC.map((r) => (
          <div key={r.k}>
            <div className="m-mini-grading__rubric-row">
              <span className="m-mini-grading__rubric-row-label">{r.k}</span>
              <span className="m-mono">
                <b>{r.v}</b>
                <span className="m-mini-grading__rubric-row-max">/{r.m}</span>
              </span>
            </div>
            <div className="m-mini-grading__rubric-bar">
              <div
                className="m-mini-grading__rubric-bar-fill"
                style={{ width: `${(r.v / r.m) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <div className="m-mini-grading__total">
          <div className="m-mini-grading__total-score">86</div>
          <div className="m-mini-grading__total-max">/100</div>
          <div className="m-mini-grading__grade-pill">B+</div>
        </div>
      </div>
    </div>
  );
}
