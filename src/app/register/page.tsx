import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field, SelectField } from "@/components/auth/field";
import { PERSONAS } from "@/lib/personas";

export const metadata: Metadata = {
  title: "Request a tenant",
};

const ROLE_OPTIONS = [
  { value: "registrar", label: "Registrar" },
  { value: "dean", label: "Dean / Department Chair" },
  { value: "it", label: "IT / Systems administrator" },
  { value: "admissions", label: "Admissions" },
  { value: "faculty", label: "Faculty / Instructor" },
  { value: "provost", label: "Provost / VP" },
  { value: "other", label: "Other" },
] as const;

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
      <SelectField
        label="Your role"
        name="role"
        defaultValue="registrar"
        options={ROLE_OPTIONS}
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

      <p className="m-auth__alt">
        Already have a tenant? <Link href="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}
