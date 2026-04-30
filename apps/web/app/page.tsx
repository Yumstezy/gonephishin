import { Hero } from "@/components/marketing/hero";
import { MarketingNav } from "@/components/marketing/nav";
import { ComparePathsSection } from "@/components/marketing/compare-paths-section";
import { HowItWorks } from "@/components/ui/how-it-works";
import FAQ from "@/components/ui/faq";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <>
      <MarketingNav />
      <Hero />
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <ComparePathsSection />
      <section id="faq">
        <FAQ />
      </section>
      <Footer />
    </>
  );
}
