'use client';

import { useState, useRef } from "react";
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
import BookingModal from "@/components/BookingModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar onBookDemo={openModal} />
      <Hero onGetStarted={scrollToPricing} />
      <Problem />
      <Industries />
      <ROICalculator />
      <HowSkadiFixesIt />
      {/* <Features /> */}
      <Testimonial />
      <Pricing ref={pricingRef} onBookDemo={openModal} />
      <CTA onBookDemo={openModal} />
      <Footer />
      <BookingModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
