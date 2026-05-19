import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { PERSONAS } from "@/lib/personas";

export const metadata: Metadata = {
  title: "Welcome aboard",
};

// Synthetic tenant slug — looks like a real provisioned id every refresh.
function tenantSlug(): string {
  const chars = "abcdefghjkmnpqrstvwxyz23456789";
  let s = "";
  for (let i = 0; i < 7; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

export default function VerifyPage() {
  const slug = tenantSlug();
  return (
    <AuthShell>
      <div className="m-success-icon">
        <Check size={26} strokeWidth={2.4} />
      </div>
      <div className="m-eyebrow mb-3">Email verified</div>
      <h1 className="m-auth__h">Welcome to Meridian.</h1>
      <p className="m-auth__sub">
        Your tenant is provisioned and seeded with a full demo cohort. Pick up
        where the demo begins.
      </p>

      <Link
        href={PERSONAS.admin.homeHref}
        className="m-btn m-btn--primary m-btn--block"
      >
        Continue to your dashboard →
      </Link>

      <p className="m-auth__meta m-mono">
        tenant: aldridge-{slug} · region: us-east-1 · provisioned just now
      </p>
    </AuthShell>
  );
}
