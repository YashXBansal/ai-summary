import BgGradient from "@/components/common/bg-gradient";
import DemoSection from "@/components/home/demoSection";
import HeroSection from "@/components/home/heroSection";
import HowItWorksSection from "@/components/home/how-it-works";
function page() {
  return (
    <div className="relative w-full ">
      <BgGradient>
        <div className="flex flex-col">
          <HeroSection />
          <DemoSection />
          <HowItWorksSection />
        </div>
      </BgGradient>
      {/* <PricingSection /> */}
      {/* <CTASection /> */}
    </div>
  );
}

export default page;
