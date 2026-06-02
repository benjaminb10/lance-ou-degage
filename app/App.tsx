import { Hero } from "~/components/landing/Hero";
import { ProblemSection } from "~/components/landing/ProblemSection";
import { HowItWorks } from "~/components/landing/HowItWorks";
import { RoadProgression } from "~/components/landing/RoadProgression";
import { Stakes } from "~/components/landing/Stakes";
import { SocialProof } from "~/components/landing/SocialProof";
import { Pricing } from "~/components/landing/Pricing";
import { FAQ } from "~/components/landing/FAQ";
import { Footer } from "~/components/landing/Footer";

export function App() {
  return (
    <>
      {/* Grain overlay */}
      <div className="grain" aria-hidden="true" />

      <main className="relative">
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <RoadProgression />
        <Stakes />
        <SocialProof />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
