import { ArrowRight, Shield } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/auth/field";
import { PERSONAS, ROLE_ORDER } from "@/lib/personas";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="m-eyebrow mb-3">Sign in</div>
      <h1 className="m-auth__h">Welcome back.</h1>
      <p className="m-auth__sub">
        Jump in as a demo persona, or sign in with your institutional account.
      </p>

      <div className="m-persona-picker">
        <div className="m-persona-picker__label">
          Demo personas · instant entry
        </div>
        {ROLE_ORDER.map((role) => {
          const p = PERSONAS[role];
          return (
            <Link
              key={role}
              href={p.homeHref}
              className="m-persona-picker__row"
            >
              <div className="m-avatar">{p.initials}</div>
              <div className="m-persona-picker__meta">
                <b>{p.fullName}</b>
                <span>Continue as {p.roleTitle}</span>
              </div>
              <ArrowRight size={14} className="m-persona-picker__arrow" />
            </Link>
          );
        })}
      </div>

      <div className="m-auth__divider">
        <hr />
        <span>or sign in</span>
        <hr />
      </div>

      <button type="button" className="m-btn m-btn--block">
        <Shield size={14} /> Continue with Okta SSO
      </button>

      <div className="h-3.5" />
      <Field
        label="Email"
        type="email"
        defaultValue="i.halvorsen@aldridge.edu"
        autoComplete="email"
        name="email"
      />
      <div className="h-3.5" />
      <Field
        label="Password"
        type="password"
        defaultValue="••••••••••••"
        autoComplete="current-password"
        name="password"
      />

      <div className="m-row mt-3.5 text-xs">
        <label className="m-check">
          <input type="checkbox" defaultChecked />
          Remember this device for 30 days
        </label>
        <span className="m-spacer" />
        <Link href="/forgot" className="text-m-accent no-underline">
          Forgot password
        </Link>
      </div>

      <Link
        href={PERSONAS.admin.homeHref}
        className="m-btn m-btn--primary m-btn--block mt-4.5"
      >
        Sign in
      </Link>

      <p className="m-auth__alt">
        New to Meridian? <Link href="/register">Request access →</Link>
      </p>
    </AuthShell>
  );
}
