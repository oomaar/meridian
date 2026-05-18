import { MiniGradingPreview } from "@/components/landing/mini-grading-preview";

const GRADING_STATS = [
  { k: "Avg. turnaround", v: "38h", d: "down from 62h" },
  { k: "Faculty NPS", v: "+71", d: "F25 quarterly" },
  { k: "Late submissions", v: "4.2%", d: "of all grades" },
  { k: "Autograder coverage", v: "73%", d: "of CS sections" },
];

export function GradingPreviewSection() {
  return (
    <section className="m-landing__section">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div className="m-preview-frame">
          <div className="m-preview-chrome">
            <div className="m-preview-dots">
              <span />
              <span />
              <span />
            </div>
            <div className="m-preview-url m-mono">/instructor/grading</div>
          </div>
          <MiniGradingPreview />
        </div>
        <div>
          <div className="m-eyebrow">Faculty workflow</div>
          <h2 className="m-section-title">
            Rubric-driven grading. Side-by-side with the work.
          </h2>
          <p
            style={{
              color: "var(--m-text-2)",
              fontSize: 15,
              lineHeight: 1.6,
              marginTop: 14,
            }}
          >
            Submissions, autograder signal, rubric, and queue navigation all
            live in the same view. Faculty keep their flow; students get faster,
            more substantive feedback.
          </p>
          <div className="m-grid m-grid-2" style={{ marginTop: 26, gap: 14 }}>
            {GRADING_STATS.map((s) => (
              <div
                key={s.k}
                style={{
                  padding: 16,
                  border: "1px solid var(--m-line)",
                  borderRadius: 8,
                  background: "var(--m-surface)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--m-text-3)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.k}
                </div>
                <div
                  style={{
                    fontFamily: "var(--m-font-serif)",
                    fontSize: 28,
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    marginTop: 4,
                  }}
                >
                  {s.v}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--m-text-3)" }}>
                  {s.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
