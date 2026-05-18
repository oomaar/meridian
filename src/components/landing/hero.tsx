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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 12px",
              border: "1px solid var(--m-line)",
              borderRadius: 100,
              fontSize: 12,
              color: "var(--m-text-2)",
            }}
          >
            <span className="m-pulse-dot" />
            <span>Trusted by 142 institutions · 1.4M students worldwide</span>
          </div>
          <h1 className="m-landing__h1" style={{ marginTop: 28 }}>
            The operating system for <em>modern universities</em>.
          </h1>
          <p className="m-landing__lede">
            Meridian unifies enrollment, course delivery, grading, advising, and
            analytics in a single operational fabric — engineered for the long
            days of registrars, deans, and faculty who keep an institution
            running.
          </p>
          <div className="m-row" style={{ marginTop: 32, gap: 10 }}>
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
          <div
            className="m-row m-mono"
            style={{
              marginTop: 18,
              gap: 18,
              fontSize: 12,
              color: "var(--m-text-3)",
            }}
          >
            <span>No sign-up required</span>
            <span>·</span>
            <span>Live operational data</span>
            <span>·</span>
            <span>Toggle role from any screen</span>
          </div>
        </div>

        <div
          className="m-preview-frame"
          style={{ transform: "translateY(8px)" }}
        >
          <div className="m-preview-chrome">
            <div className="m-preview-dots">
              <span />
              <span />
              <span />
            </div>
            <div className="m-preview-url m-mono">
              meridian.aldridge.edu/admin/overview
            </div>
            <RefreshCw size={12} style={{ color: "var(--m-text-3)" }} />
          </div>
          <MiniPreview />
        </div>
      </div>

      <div
        style={{
          marginTop: 72,
          paddingTop: 36,
          borderTop: "1px solid var(--m-line)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "var(--m-text-3)",
            marginBottom: 18,
          }}
        >
          Used daily by operations teams at
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 24,
            alignItems: "center",
            color: "var(--m-text-3)",
          }}
        >
          {INSTITUTIONS.map((l) => (
            <div
              key={l.name}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                opacity: 0.75,
              }}
            >
              <b
                style={{
                  fontFamily: "var(--m-font-serif)",
                  fontSize: 17,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {l.name}
              </b>
              <span
                style={{
                  fontSize: 10.5,
                  fontFamily: "var(--m-font-mono)",
                  letterSpacing: ".02em",
                }}
              >
                {l.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
