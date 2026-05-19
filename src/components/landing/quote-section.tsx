import { Sparkles } from "lucide-react";

export function QuoteSection() {
  return (
    <section className="m-landing__section py-20">
      <div className="max-w-220 mx-auto text-center">
        <Sparkles size={20} className="text-m-accent mb-3.5" />
        <blockquote className="font-m-serif italic text-m-text text-[clamp(22px,2.6vw,32px)] tracking-[-0.01em] leading-[1.35] m-0">
          &ldquo;We stopped maintaining four separate systems the week Meridian
          went live. Our registrar reports it gave her back roughly an afternoon
          a week — and the operational picture is finally honest.&rdquo;
        </blockquote>
        <div className="mt-7.5 flex justify-center items-center gap-3.5">
          <div className="m-avatar m-avatar--lg">MP</div>
          <div className="text-left leading-[1.2]">
            <b className="text-sm">Marcus Penninger, Ph.D.</b>
            <div className="text-xs text-m-text-3">
              Provost · Penninger Institute of Technology
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
