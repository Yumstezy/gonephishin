import { Hero } from "@/components/marketing/hero";
import { MarketingNav } from "@/components/marketing/nav";
import { ValuePropsSection } from "@/components/marketing/value-props-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { ComparePathsSection } from "@/components/marketing/compare-paths-section";
import { PrivacySection } from "@/components/marketing/privacy-section";
import { FAQSection } from "@/components/marketing/faq-section";
import { FooterSection } from "@/components/marketing/footer-section";

export default function Home() {
  return (
    <>
      <MarketingNav />
      <main>
        <Hero />
        <ValuePropsSection />
        <HowItWorksSection />
        <ComparePathsSection />
        <PrivacySection />
        <FAQSection />
      </main>
      <FooterSection />
    </>
  );
}
