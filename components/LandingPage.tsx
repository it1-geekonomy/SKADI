'use client';

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowSkadiFixesIt from "@/components/HowSkadiFixesIt";
import Testimonial from "@/components/Testimonial";
import ROICalculator from "@/components/ROICalculator";
import Industries from "@/components/Industries";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";

export default function LandingPage() {
  const router = useRouter();
  const pricingRef = useRef<HTMLDivElement>(null);

  const openBookingModal = () => router.push("/listentoskadi", { scroll: false });

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero onGetStarted={scrollToPricing} />
      <Problem />
      <Industries />
      <ROICalculator />
      <HowSkadiFixesIt />
      {/* <Features /> */}
      <Testimonial />
      <Pricing ref={pricingRef} onBookDemo={openBookingModal} />
      <CTA onBookDemo={openBookingModal} />
    </>
  );
}
