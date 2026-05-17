import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const DEFAULT_FOOTER =
  "meridian operations · v4.2.18 · all systems nominal";

export function AuthShell({
  children,
  footer = DEFAULT_FOOTER,
}: {
  children: ReactNode;
  footer?: string;
}) {
  return (
    <div className="m-auth">
      <div className="m-auth__form-col">
        <Link href="/" className="m-auth__brand">
          <div
            className="m-brand-mark"
            style={{ width: 30, height: 30, fontSize: 17 }}
          >
            M
          </div>
          <b
            style={{
              fontFamily: "var(--m-font-serif)",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            Meridian
          </b>
        </Link>

        <div className="m-auth__center">
          <div className="m-auth__inner">{children}</div>
        </div>

        <div className="m-auth__foot m-mono">{footer}</div>
      </div>

      <div className="m-auth__quote-col">
        <div className="m-auth__quote-glow" />
        <div className="m-auth__quote-grid" />
        <div className="m-auth__quote-content">
          <Sparkles
            size={20}
            style={{ color: "var(--m-accent)", marginBottom: 18 }}
          />
          <blockquote className="m-auth__quote-text">
            &ldquo;The first time in fifteen years that running a 14,000-student
            institution feels coherent.&rdquo;
          </blockquote>
          <div className="m-auth__quote-author">
            Ines Halvorsen · Registrar, Aldridge University
          </div>
        </div>
      </div>
    </div>
  );
}
