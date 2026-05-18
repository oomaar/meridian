import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PERSONAS } from "@/lib/personas";

export function FinalCta() {
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
