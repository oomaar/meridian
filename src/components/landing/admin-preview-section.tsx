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
      <div className="m-section-split m-section-split--reverse">
        <div>
          <div className="m-eyebrow">Operations dashboard</div>
          <h2 className="m-section-title">The active term in one frame.</h2>
          <p className="m-section-copy">
            The overview is the single screen your registrar opens first.
            Submission throughput, grading SLA, petitions, faculty health —
            everything is rolled into a quiet operating picture.
          </p>
          <div className="flex flex-col mt-6.5 gap-4.5">
            {DASHBOARD_FEATURES.map((f) => (
              <div
                key={f.t}
                className="grid grid-cols-[16px_1fr] gap-3.5 items-start"
              >
                <Check size={14} className="text-m-accent mt-1" />
                <div>
                  <b className="text-sm">{f.t}</b>
                  <p className="text-[13.5px] leading-[1.55] mt-1 mb-0 text-m-text-2">
                    {f.b}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link className="m-btn m-btn--lg mt-7" href={PERSONAS.admin.homeHref}>
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
            <div className="m-preview-url font-m-mono">/admin/overview</div>
          </div>
          <MiniPreview compact />
        </div>
      </div>
    </section>
  );
}
