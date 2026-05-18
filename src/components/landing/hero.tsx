import { ArrowUpRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { MiniPreview } from "@/components/landing/mini-preview";
import { PERSONAS } from "@/lib/personas";

const INSTITUTIONS = [
  { name: "Aldridge", note: "est. 1879" },
  { name: "Penninger Tech", note: "est. 1903" },
  { name: "Harrowford", note: "est. 1842" },
  { name: "St. Almira", note: "est. 1851" },
  { name: "Northbrook", note: "est. 1899" },
  { name: "Vesper Academy", note: "est. 1928" },
];

export function Hero() {
  return (
    <section className="m-landing__hero">
      <div className="m-section-split">
        <div>
          <div className="m-pill">
            <span className="m-pulse-dot" />
            <span>Trusted by 142 institutions · 1.4M students worldwide</span>
          </div>
          <h1 className="m-landing__h1 mt-7">
            The operating system for <em>modern universities</em>.
          </h1>
          <p className="m-landing__lede">
            Meridian unifies enrollment, course delivery, grading, advising, and
            analytics in a single operational fabric — engineered for the long
            days of registrars, deans, and faculty who keep an institution
            running.
          </p>
          <div className="flex items-center flex-wrap mt-8 gap-2.5">
            <Link
              className="m-btn m-btn--primary m-btn--lg"
              href={PERSONAS.admin.homeHref}
            >
              Explore as Administrator <ArrowUpRight size={14} />
            </Link>
            <Link
              className="m-btn m-btn--lg"
              href={PERSONAS.instructor.homeHref}
            >
              Explore as Instructor
            </Link>
            <Link className="m-btn m-btn--lg" href={PERSONAS.student.homeHref}>
              Explore as Student
            </Link>
          </div>
          <div className="font-m-mono flex items-center flex-wrap mt-4.5 gap-4.5 text-xs text-m-text-3">
            <span>No sign-up required</span>
            <span>·</span>
            <span>Live operational data</span>
            <span>·</span>
            <span>Toggle role from any screen</span>
          </div>
        </div>

        <div className="m-preview-frame translate-y-2">
          <div className="m-preview-chrome">
            <div className="m-preview-dots">
              <span />
              <span />
              <span />
            </div>
            <div className="m-preview-url font-m-mono">
              meridian.aldridge.edu/admin/overview
            </div>
            <RefreshCw size={12} className="text-m-text-3" />
          </div>
          <MiniPreview />
        </div>
      </div>

      <div className="mt-18 pt-9 border-t border-m-line">
        <div className="text-[11px] tracking-[.08em] uppercase text-m-text-3 mb-4.5 font-medium">
          Used daily by operations teams at
        </div>
        <div className="grid grid-cols-2 min-[880px]:grid-cols-6 gap-4.5 min-[880px]:gap-6 items-center text-m-text-3">
          {INSTITUTIONS.map((l) => (
            <div key={l.name} className="flex flex-col gap-0.75 opacity-75">
              <b className="font-m-serif text-[17px] font-medium tracking-[-0.01em]">
                {l.name}
              </b>
              <span className="font-m-mono text-[10.5px] tracking-[.02em]">
                {l.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
