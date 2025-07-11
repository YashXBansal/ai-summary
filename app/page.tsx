import BgGradient from "@/components/common/bg-gradient";
import CTASection from "@/components/home/cta-section";
import DemoSection from "@/components/home/demoSection";
import HeroSection from "@/components/home/heroSection";
import HowItWorksSection from "@/components/home/how-it-works";
import PricingSection from "@/components/home/pricing";
function page() {
  return (
    <div className="relative w-full ">
      <BgGradient>
        <div className="flex flex-col">
          <HeroSection />
          <DemoSection />
          <HowItWorksSection />
          <PricingSection />
          <CTASection />
        </div>
      </BgGradient>
    </div>
  );
}

export default page;
