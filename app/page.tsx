import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowSkadiFixesIt from "@/components/HowSkadiFixesIt";
import Features from "@/components/Features";
import Testimonial from "@/components/Testimonial";
import ROICalculator from "@/components/ROICalculator";
import Industries from "@/components/Industries";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Problem />
      <HowSkadiFixesIt />
      <Features />
      <Testimonial />
      <ROICalculator />
      <Industries />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
