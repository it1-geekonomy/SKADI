import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Skadi",
  description: "Secure access to your Skadi AI dashboard.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-forest font-inter">
      {children}
    </div>
  );
}
