import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Skadi — Always On. Always Closing.",
  description: "An AI voice agent that picks up every call, qualifies every lead, and books every appointment — 24 hours a day, 7 days a week.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${inter.variable} font-inter bg-parchment text-obsidian font-normal`}>
        {children}
      </body>
    </html>
  );
}
