import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/auth/field";
import { PERSONAS } from "@/lib/personas";

export const metadata: Metadata = {
  title: "Request a tenant",
};

export default function RegisterPage() {
  return (
    <AuthShell>
      <div className="m-eyebrow" style={{ marginBottom: 12 }}>
        Request access
      </div>
      <h1 className="m-auth__h">Request a Meridian tenant.</h1>
      <p className="m-auth__sub">
        Tell us about your institution. A team member will be in touch within
        one business day.
      </p>

      <Field
        label="Institution"
        placeholder="Aldridge University"
        autoComplete="organization"
        name="institution"
      />
      <div style={{ height: 14 }} />
      <Field
        label="Your role"
        placeholder="Registrar, Dean, IT director, …"
        autoComplete="organization-title"
        name="role"
      />
      <div style={{ height: 14 }} />
      <Field
        label="Work email"
        type="email"
        placeholder="you@yourschool.edu"
        autoComplete="email"
        name="email"
      />

      <Link
        href={PERSONAS.admin.homeHref}
        className="m-btn m-btn--primary"
        style={{ width: "100%", height: 40, marginTop: 22 }}
      >
        Request access
      </Link>

      <p
        style={{
          marginTop: 18,
          fontSize: 13,
          color: "var(--m-text-3)",
        }}
      >
        Already have a tenant?{" "}
        <Link href="/login" style={{ color: "var(--m-accent)" }}>
          Sign in
        </Link>
      </p>

      <div className="m-auth__hint">
        <b>Want to see it first?</b> Walk through the demo as{" "}
        <Link href={PERSONAS.admin.homeHref}>an admin →</Link>
      </div>
    </AuthShell>
  );
}
