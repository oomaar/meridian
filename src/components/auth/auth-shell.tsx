import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const DEFAULT_FOOTER = "meridian operations · v4.2.18 · all systems nominal";

type AuthShellProps = {
  children: ReactNode;
  footer?: string;
};

export function AuthShell({
  children,
  footer = DEFAULT_FOOTER,
}: AuthShellProps) {
  return (
    <div className="m-auth">
      <div className="m-auth__form-col">
        <Link href="/" className="m-auth__brand">
          <div className="m-brand-mark m-brand-mark--lg">M</div>
          <b className="font-m-serif text-lg font-medium">Meridian</b>
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
          <Sparkles size={20} className="text-m-accent mb-4.5" />
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
