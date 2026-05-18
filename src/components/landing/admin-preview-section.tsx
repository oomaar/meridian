import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { PERSONAS } from "@/lib/personas";
import { MiniPreview } from "@/components/landing/mini-preview";

const DASHBOARD_FEATURES = [
  {
    t: "Real submission throughput",
    b: "12-week rolling window, live from grading events. Identify weeks where load is climbing before it breaks.",
  },
  {
    t: "Grading SLA tracking",
    b: "Departments that breach the 72-hour grading SLA bubble up automatically, with one-click escalation.",
  },
  {
    t: "Petition queues with intent",
    b: "Late-adds, drops, and incompletes are surfaced in priority order, with the right approvers pre-wired.",
  },
];

export function AdminPreviewSection() {
  return (
    <section className="m-landing__section">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div>
          <div className="m-eyebrow">Operations dashboard</div>
          <h2 className="m-section-title">The active term in one frame.</h2>
          <p
            style={{
              color: "var(--m-text-2)",
              fontSize: 15,
              lineHeight: 1.6,
              marginTop: 14,
            }}
          >
            The overview is the single screen your registrar opens first.
            Submission throughput, grading SLA, petitions, faculty health —
            everything is rolled into a quiet operating picture.
          </p>
          <div className="m-stack" style={{ marginTop: 26, gap: 18 }}>
            {DASHBOARD_FEATURES.map((f) => (
              <div
                key={f.t}
                style={{
                  display: "grid",
                  gridTemplateColumns: "16px 1fr",
                  gap: 14,
                  alignItems: "start",
                }}
              >
                <Check
                  size={14}
                  style={{ color: "var(--m-accent)", marginTop: 4 }}
                />
                <div>
                  <b style={{ fontSize: 14 }}>{f.t}</b>
                  <p
                    style={{
                      color: "var(--m-text-2)",
                      fontSize: 13.5,
                      lineHeight: 1.55,
                      margin: "4px 0 0",
                    }}
                  >
                    {f.b}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            className="m-btn m-btn--lg"
            style={{ marginTop: 28 }}
            href={PERSONAS.admin.homeHref}
          >
            Open admin demo <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="m-preview-frame">
          <div className="m-preview-chrome">
            <div className="m-preview-dots">
              <span />
              <span />
              <span />
            </div>
            <div className="m-preview-url m-mono">/admin/overview</div>
          </div>
          <MiniPreview compact />
        </div>
      </div>
    </section>
  );
}
