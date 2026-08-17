'use client';

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowSkadiFixesIt from "@/components/HowSkadiFixesIt";
import Testimonial from "@/components/Testimonial";
import ROICalculator from "@/components/ROICalculator";
import Industries from "@/components/Industries";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import BookingModal from "@/components/BookingModal";

export default function LandingPage() {
  const router = useRouter();
  const pricingRef = useRef<HTMLDivElement>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const openBookingModal = () => router.push("/listentoskadi", { scroll: false });

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero onGetStarted={openBookingModal} />
      <Problem />
      <Industries />
      <ROICalculator />
      <HowSkadiFixesIt />
      {/* <Features /> */}
      <Testimonial />
      <Pricing ref={pricingRef} onBookDemo={openBookingModal} />
      <FAQ />
      <CTA onBookDemo={openBookingModal} />
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </>
  );
}
