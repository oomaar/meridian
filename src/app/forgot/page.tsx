import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/auth/field";
import { PERSONAS } from "@/lib/personas";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ForgotPage() {
  return (
    <AuthShell>
      <div className="m-eyebrow" style={{ marginBottom: 12 }}>
        Reset access
      </div>
      <h1 className="m-auth__h">Forgot your password?</h1>
      <p className="m-auth__sub">
        Enter the email tied to your Meridian account. If a matching tenant
        exists, we&apos;ll send a reset link within a minute.
      </p>

      <Field
        label="Email"
        type="email"
        defaultValue="i.halvorsen@aldridge.edu"
        autoComplete="email"
        name="email"
      />

      <Link
        href="/login"
        className="m-btn m-btn--primary"
        style={{ width: "100%", height: 40, marginTop: 22 }}
      >
        Send reset link
      </Link>

      <Link href="/login" className="m-auth__back">
        <ArrowLeft size={12} /> Back to sign in
      </Link>

      <div className="m-auth__hint">
        <b>Just exploring?</b> Skip the reset flow and{" "}
        <Link href={PERSONAS.admin.homeHref}>open the demo →</Link>
      </div>
    </AuthShell>
  );
}
