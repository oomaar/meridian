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
      <p className="m-section-copy">
        Meridian doesn&apos;t ask you to bend your processes around a template.
        Each surface — from semester transitions to grade releases — is modeled
        on the work people actually do.
      </p>

      <div className="mt-9 grid grid-cols-1 min-[880px]:grid-cols-3 gap-4.5">
        {OPERATIONAL_CARDS.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.go}
              href={p.go}
              className="m-card block p-7 cursor-pointer text-inherit no-underline"
            >
              <div className="m-icon-tile mb-4">
                <Icon size={18} />
              </div>
              <div className="m-eyebrow text-[10.5px]">{p.eyebrow}</div>
              <h3 className="font-m-serif text-[22px] tracking-[-0.01em] mt-1.5 mb-2.5 leading-[1.15]">
                {p.title}
              </h3>
              <p className="text-[13.5px] leading-[1.6] m-0 text-m-text-2">
                {p.copy}
              </p>
              <div className="flex items-center gap-2.5 mt-4.5 text-[13px] text-m-accent">
                <span>Open preview</span> <ArrowUpRight size={12} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
