import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PERSONAS } from "@/lib/personas";

export function FinalCta() {
  return (
    <section className="m-landing__section min-[880px]:py-18">
      <div className="grid grid-cols-1 min-[880px]:grid-cols-[1fr_auto] gap-10 items-center">
        <div>
          <h2 className="m-section-title max-w-[20ch]">
            Step into the demo. No sign-up.
          </h2>
          <p className="m-section-copy mt-3">
            The demo runs against a seeded Aldridge University instance. Switch
            roles at will from the sidebar; every screen is wired to real
            workflows.
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2.5">
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
