import {
  ArrowUpRight,
  BookOpen,
  Check,
  LayoutDashboard,
  PenLine,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { MiniGradingPreview } from "@/components/landing/mini-grading-preview";
import { MiniPreview } from "@/components/landing/mini-preview";
import { ThemeToggle } from "@/components/theme-toggle";
import { PERSONAS } from "@/lib/personas";

const INSTITUTIONS = [
  { name: "Aldridge", note: "est. 1879" },
  { name: "Penninger Tech", note: "est. 1903" },
  { name: "Harrowford", note: "est. 1842" },
  { name: "St. Almira", note: "est. 1851" },
  { name: "Northbrook", note: "est. 1899" },
  { name: "Vesper Academy", note: "est. 1928" },
];

const OPERATIONAL_CARDS = [
  {
    eyebrow: "OPERATIONS",
    title: "Active term, in one frame.",
    copy:
      "A single page that holds the entire term: enrollment, throughput, ungraded queues, pending petitions, and rule-based alerts. Built so registrars can scan it before coffee finishes brewing.",
    icon: LayoutDashboard,
    go: PERSONAS.admin.homeHref,
  },
  {
    eyebrow: "INSTRUCTORS",
    title: "Grading workflow that respects time.",
    copy:
      "Rubric-driven grading with inline code feedback, auto-test signal, and queue-aware navigation. Anchored on the median 38-hour turnaround your faculty already aim for.",
    icon: PenLine,
    go: PERSONAS.instructor.homeHref,
  },
  {
    eyebrow: "STUDENTS",
    title: "A calm place to learn.",
    copy:
      "Continuity-first learning surfaces: pick up exactly where you left off, see what's due, and never wonder what comes next. Designed for the long arc of a degree.",
    icon: BookOpen,
    go: PERSONAS.student.homeHref,
  },
] as const;

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

const GRADING_STATS = [
  { k: "Avg. turnaround", v: "38h", d: "down from 62h" },
  { k: "Faculty NPS", v: "+71", d: "F25 quarterly" },
  { k: "Late submissions", v: "4.2%", d: "of all grades" },
  { k: "Autograder coverage", v: "73%", d: "of CS sections" },
];

export default function LandingPage() {
  return (
    <div className="m-landing">
      <LandingNav />
      <Hero />
      <hr className="m-landing__rule" />
      <OperationalPreviews />
      <hr className="m-landing__rule" />
      <AdminPreviewSection />
      <hr className="m-landing__rule" />
      <GradingPreviewSection />
      <hr className="m-landing__rule" />
      <QuoteSection />
      <hr className="m-landing__rule" />
      <FinalCta />
      <LandingFooter />
    </div>
  );
}

function LandingNav() {
  return (
    <div className="m-landing__nav">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          className="m-brand-mark"
          style={{ width: 30, height: 30, fontSize: 17 }}
        >
          M
        </div>
        <b
          style={{
            fontFamily: "var(--m-font-serif)",
            fontWeight: 500,
            fontSize: 18,
            letterSpacing: "-0.01em",
          }}
        >
          Meridian
        </b>
        <span
          className="m-mono"
          style={{
            fontSize: 11.5,
            color: "var(--m-text-3)",
            marginLeft: 6,
          }}
        >
          / operations · v4.2
        </span>
      </div>
      <nav
        style={{
          marginLeft: 48,
          display: "flex",
          gap: 24,
          fontSize: 13,
          color: "var(--m-text-2)",
        }}
      >
        <a style={{ cursor: "pointer" }}>Platform</a>
        <a style={{ cursor: "pointer" }}>For institutions</a>
        <a style={{ cursor: "pointer" }}>Customers</a>
        <a style={{ cursor: "pointer" }}>Pricing</a>
        <a style={{ cursor: "pointer" }}>Changelog</a>
      </nav>
      <div className="m-spacer" />
      <div className="m-row" style={{ gap: 8 }}>
        <ThemeToggle />
        <Link className="m-btn m-btn--ghost m-btn--sm" href="/login">
          Sign in
        </Link>
        <Link
          className="m-btn m-btn--primary m-btn--sm"
          href={PERSONAS.admin.homeHref}
        >
          Explore the demo <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}

function Hero() {
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
            Meridian unifies enrollment, course delivery, grading, advising,
            and analytics in a single operational fabric — engineered for the
            long days of registrars, deans, and faculty who keep an
            institution running.
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

        <div className="m-preview-frame" style={{ transform: "translateY(8px)" }}>
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

function OperationalPreviews() {
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

function AdminPreviewSection() {
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

function GradingPreviewSection() {
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
            live in the same view. Faculty keep their flow; students get
            faster, more substantive feedback.
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

function QuoteSection() {
  return (
    <section
      className="m-landing__section"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
        <Sparkles
          size={20}
          style={{ color: "var(--m-accent)", marginBottom: 14 }}
        />
        <blockquote
          style={{
            fontFamily: "var(--m-font-serif)",
            fontWeight: 400,
            fontSize: "clamp(22px, 2.6vw, 32px)",
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
            color: "var(--m-text)",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          &ldquo;We stopped maintaining four separate systems the week Meridian
          went live. Our registrar reports it gave her back roughly an
          afternoon a week — and the operational picture is finally
          honest.&rdquo;
        </blockquote>
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div className="m-avatar m-avatar--lg">MP</div>
          <div style={{ textAlign: "left", lineHeight: 1.2 }}>
            <b style={{ fontSize: 14 }}>Marcus Penninger, Ph.D.</b>
            <div style={{ fontSize: 12, color: "var(--m-text-3)" }}>
              Provost · Penninger Institute of Technology
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="m-landing__section" style={{ padding: "72px 40px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div>
          <h2 className="m-section-title" style={{ maxWidth: "20ch" }}>
            Step into the demo. No sign-up.
          </h2>
          <p
            style={{
              color: "var(--m-text-2)",
              fontSize: 15,
              marginTop: 12,
              maxWidth: "60ch",
            }}
          >
            The demo runs against a seeded Aldridge University instance. Switch
            roles at will from the sidebar; every screen is wired to real
            workflows.
          </p>
        </div>
        <div className="m-row" style={{ gap: 10 }}>
          <Link
            className="m-btn m-btn--primary m-btn--lg"
            href={PERSONAS.admin.homeHref}
          >
            Explore as Admin <ArrowUpRight size={14} />
          </Link>
          <Link className="m-btn m-btn--lg" href="/register">
            Request a tenant
          </Link>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--m-line)",
        padding: "32px 40px",
        maxWidth: 1280,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        gap: 16,
        color: "var(--m-text-3)",
        fontSize: 12,
      }}
    >
      <div
        className="m-brand-mark"
        style={{ width: 22, height: 22, fontSize: 13 }}
      >
        M
      </div>
      <span>
        Meridian Operations Inc. · Princeton, NJ · v4.2.18 · build 0c9a142
      </span>
      <span className="m-spacer" />
      <a style={{ cursor: "pointer" }}>Privacy</a>
      <a style={{ cursor: "pointer" }}>Terms</a>
      <a style={{ cursor: "pointer" }}>Status</a>
      <a style={{ cursor: "pointer" }}>Security</a>
    </footer>
  );
}
