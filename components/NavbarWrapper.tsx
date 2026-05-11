'use client';

import { useState } from "react";
import Navbar from "@/components/Navbar";
import BookingModal from "@/components/BookingModal";

export default function NavbarWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Navbar onBookDemo={() => setIsModalOpen(true)} />
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}