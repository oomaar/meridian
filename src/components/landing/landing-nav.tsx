import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PERSONAS } from "@/lib/personas";

export function LandingNav() {
  return (
    <div className="m-landing__nav">
      <div className="m-landing__nav-brand">
        <div className="m-brand-mark m-brand-mark--lg">M</div>
        <b>Meridian</b>
        <span className="m-mono m-landing__nav-version">
          / operations · v4.2
        </span>
      </div>
      <nav className="m-landing__nav-links">
        <a>Platform</a>
        <a>For institutions</a>
        <a>Customers</a>
        <a>Pricing</a>
        <a>Changelog</a>
      </nav>
      <div className="m-spacer" />
      <div className="m-landing__nav-actions">
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
