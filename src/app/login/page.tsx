import { Shield } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/auth/field";
import { PERSONAS } from "@/lib/personas";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="m-eyebrow" style={{ marginBottom: 12 }}>
        Sign in
      </div>
      <h1 className="m-auth__h">Welcome back.</h1>
      <p className="m-auth__sub">Sign in with your institutional account.</p>

      <button
        type="button"
        className="m-btn"
        style={{ width: "100%", height: 40 }}
      >
        <Shield size={14} /> Continue with Okta SSO
      </button>

      <div className="m-auth__divider">
        <hr />
        <span>or with email</span>
        <hr />
      </div>

      <Field
        label="Email"
        type="email"
        defaultValue="i.halvorsen@aldridge.edu"
        autoComplete="email"
        name="email"
      />
      <div style={{ height: 14 }} />
      <Field
        label="Password"
        type="password"
        defaultValue="••••••••••••"
        autoComplete="current-password"
        name="password"
      />

      <div className="m-row" style={{ marginTop: 14, fontSize: 12 }}>
        <label className="m-check">
          <input type="checkbox" defaultChecked />
          Remember this device for 30 days
        </label>
        <span className="m-spacer" />
        <Link
          href="/forgot"
          style={{ color: "var(--m-accent)", textDecoration: "none" }}
        >
          Forgot password
        </Link>
      </div>

      <Link
        href={PERSONAS.admin.homeHref}
        className="m-btn m-btn--primary"
        style={{ width: "100%", height: 40, marginTop: 18 }}
      >
        Sign in
      </Link>

      <div className="m-auth__hint">
        <b>No sign-up needed.</b> The demo runs against a seeded Aldridge
        instance. Skip the login and{" "}
        <Link href={PERSONAS.admin.homeHref}>explore directly →</Link>
      </div>
    </AuthShell>
  );
}
