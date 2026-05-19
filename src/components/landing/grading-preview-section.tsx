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
      <div className="m-section-split">
        <div className="m-preview-frame">
          <div className="m-preview-chrome">
            <div className="m-preview-dots">
              <span />
              <span />
              <span />
            </div>
            <div className="m-preview-url font-m-mono">/instructor/grading</div>
          </div>
          <MiniGradingPreview />
        </div>
        <div>
          <div className="m-eyebrow">Faculty workflow</div>
          <h2 className="m-section-title">
            Rubric-driven grading. Side-by-side with the work.
          </h2>
          <p className="m-section-copy">
            Submissions, autograder signal, rubric, and queue navigation all
            live in the same view. Faculty keep their flow; students get faster,
            more substantive feedback.
          </p>
          <div className="grid grid-cols-2 mt-6.5 gap-3.5">
            {GRADING_STATS.map((s) => (
              <div key={s.k} className="m-stat-tile">
                <div className="text-[11px] text-m-text-3 tracking-[.06em] uppercase">
                  {s.k}
                </div>
                <div className="font-m-serif text-[28px] tracking-[-0.02em] mt-1">
                  {s.v}
                </div>
                <div className="text-[11.5px] text-m-text-3">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
