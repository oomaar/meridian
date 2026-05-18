import { BookOpen, LayoutDashboard, PenLine, ArrowUpRight } from "lucide-react";
import { PERSONAS } from "@/lib/personas";
import Link from "next/link";

const OPERATIONAL_CARDS = [
  {
    eyebrow: "OPERATIONS",
    title: "Active term, in one frame.",
    copy: "A single page that holds the entire term: enrollment, throughput, ungraded queues, pending petitions, and rule-based alerts. Built so registrars can scan it before coffee finishes brewing.",
    icon: LayoutDashboard,
    go: PERSONAS.admin.homeHref,
  },
  {
    eyebrow: "INSTRUCTORS",
    title: "Grading workflow that respects time.",
    copy: "Rubric-driven grading with inline code feedback, auto-test signal, and queue-aware navigation. Anchored on the median 38-hour turnaround your faculty already aim for.",
    icon: PenLine,
    go: PERSONAS.instructor.homeHref,
  },
  {
    eyebrow: "STUDENTS",
    title: "A calm place to learn.",
    copy: "Continuity-first learning surfaces: pick up exactly where you left off, see what's due, and never wonder what comes next. Designed for the long arc of a degree.",
    icon: BookOpen,
    go: PERSONAS.student.homeHref,
  },
] as const;

export function OperationalPreviews() {
  return (
    <section className="m-landing__section">
      <div className="m-eyebrow">Operational previews</div>
      <h2 className="m-section-title">
        Built around the real shape of academic operations.
      </h2>
      <p
        style={{
          color: "var(--m-text-2)",
          fontSize: 15,
          maxWidth: "60ch",
          marginTop: 14,
        }}
      >
        Meridian doesn&apos;t ask you to bend your processes around a template.
        Each surface — from semester transitions to grade releases — is modeled
        on the work people actually do.
      </p>

      <div
        style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
        }}
      >
        {OPERATIONAL_CARDS.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.go}
              href={p.go}
              className="m-card"
              style={{
                padding: 28,
                cursor: "pointer",
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "var(--m-accent-bg)",
                  color: "var(--m-accent)",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 16,
                }}
              >
                <Icon size={18} />
              </div>
              <div className="m-eyebrow" style={{ fontSize: 10.5 }}>
                {p.eyebrow}
              </div>
              <h3
                style={{
                  fontFamily: "var(--m-font-serif)",
                  fontSize: 22,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  margin: "6px 0 10px",
                  lineHeight: 1.15,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  color: "var(--m-text-2)",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {p.copy}
              </p>
              <div
                className="m-row"
                style={{
                  marginTop: 18,
                  color: "var(--m-accent)",
                  fontSize: 13,
                }}
              >
                <span>Open preview</span> <ArrowUpRight size={12} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
