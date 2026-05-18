import { Sparkles } from "lucide-react";

export function QuoteSection() {
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
          went live. Our registrar reports it gave her back roughly an afternoon
          a week — and the operational picture is finally honest.&rdquo;
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
