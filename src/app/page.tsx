import { Hero } from "@/components/landing/hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { OperationalPreviews } from "@/components/landing/operational-previews";
import { AdminPreviewSection } from "@/components/landing/admin-preview-section";
import { GradingPreviewSection } from "@/components/landing/grading-preview-section";
import { QuoteSection } from "@/components/landing/quote-section";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="m-landing">
      <LandingNav />
      <Hero />
      <hr className="m-landing__rule" />
      <OperationalPreviews />
      <hr className="m-landing__rule" />
      <AdminPreviewSection />
      <hr className="m-landing__rule" />
      <GradingPreviewSection />
      <hr className="m-landing__rule" />
      <QuoteSection />
      <hr className="m-landing__rule" />
      <FinalCta />
      <LandingFooter />
    </div>
  );
}
