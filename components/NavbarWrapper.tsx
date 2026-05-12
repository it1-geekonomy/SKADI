'use client';

import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BookingModal from "@/components/BookingModal";

const BOOKING_ROUTE = "/listentoskadi";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const router = useRouter();
  const isModalOpen = pathname === BOOKING_ROUTE;

  const openBookingModal = () => {
    router.push(BOOKING_ROUTE, { scroll: false });
  };

  const closeBookingModal = () => {
    router.push("/", { scroll: false });
  };

  return (
    <>
      <Navbar onBookDemo={openBookingModal} />
      <BookingModal isOpen={isModalOpen} onClose={closeBookingModal} />
    </>
  );
}