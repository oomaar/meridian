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
    <div
      style={{
        background: "var(--m-canvas)",
        padding: 16,
        minHeight: 460,
        display: "grid",
        gridTemplateColumns: "1fr 200px",
        gap: 12,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 50,
              background: "var(--m-accent-bg)",
              color: "var(--m-accent)",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>{studentName}</div>
            <div
              style={{
                fontSize: 10.5,
                color: "var(--m-text-3)",
                fontFamily: "var(--m-font-mono)",
              }}
            >
              {submissionId} · attempt 1 · 2m ago
            </div>
          </div>
          <span
            style={{
              marginLeft: "auto",
              height: 18,
              padding: "0 7px",
              borderRadius: 3,
              background: "var(--m-success-bg)",
              color: "var(--m-success)",
              fontSize: 10.5,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Check size={9} /> 14/16
          </span>
        </div>

        <div
          style={{
            background: "var(--m-surface-2)",
            border: "1px solid var(--m-line)",
            borderRadius: 6,
            padding: 10,
            fontFamily: "var(--m-font-mono)",
            fontSize: 11,
            lineHeight: 1.55,
            color: "var(--m-text-2)",
          }}
        >
          <span style={{ color: "var(--m-text-3)" }}>def</span>{" "}
          <span style={{ color: "var(--m-accent)" }}>append_entries</span>(
          <span style={{ color: "var(--m-text-3)" }}>
            self, term, leader_id, prev_idx
          </span>
          ):
          <br />
          {"  "}
          <span style={{ color: "var(--m-text-3)" }}>if</span> term &lt;
          self.current_term:
          <br />
          {"    "}
          <span style={{ color: "var(--m-text-3)" }}>return</span>{" "}
          AppendResult(self.current_term, success=
          <span style={{ color: "var(--m-danger)" }}>False</span>)
          <br />
          <br />
          {"  "}self._reset_election_timer()
          <br />
          {"  "}self.log = self.log[:prev_idx + 1] + list(entries)
          <br />
          <br />
          <span style={{ color: "var(--m-text-3)" }}>...</span>
        </div>

        <div
          style={{
            background: "var(--m-warning-bg)",
            borderLeft: "2px solid var(--m-warning)",
            borderRadius: 4,
            padding: "6px 10px",
            marginTop: 8,
            fontSize: 11,
            color: "var(--m-warning)",
          }}
        >
          <b>Inline · line 6 ·</b>{" "}
          <span style={{ color: "var(--m-text-2)" }}>
            You truncate before checking — what if entries is empty?
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            fontSize: 10.5,
            color: "var(--m-text-3)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
          }}
        >
          Rubric · 100 pts
        </div>
        {RUBRIC.map((r) => (
          <div key={r.k}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10.5,
              }}
            >
              <span style={{ color: "var(--m-text-2)" }}>{r.k}</span>
              <span className="m-mono">
                <b>{r.v}</b>
                <span style={{ color: "var(--m-text-3)" }}>/{r.m}</span>
              </span>
            </div>
            <div
              style={{
                height: 3,
                background: "var(--m-line-soft)",
                borderRadius: 1,
                marginTop: 3,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(r.v / r.m) * 100}%`,
                  background: "var(--m-accent)",
                  borderRadius: 1,
                }}
              />
            </div>
          </div>
        ))}
        <div
          style={{
            borderTop: "1px solid var(--m-line)",
            marginTop: 6,
            paddingTop: 8,
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <div
            style={{
              fontFamily: "var(--m-font-serif)",
              fontSize: 24,
              fontWeight: 400,
            }}
          >
            86
          </div>
          <div
            style={{ marginLeft: 4, fontSize: 11, color: "var(--m-text-3)" }}
          >
            /100
          </div>
          <div
            style={{
              marginLeft: "auto",
              padding: "1px 7px",
              borderRadius: 3,
              background: "var(--m-success-bg)",
              color: "var(--m-success)",
              fontSize: 10.5,
              fontWeight: 500,
            }}
          >
            B+
          </div>
        </div>
      </div>
    </div>
  );
}
