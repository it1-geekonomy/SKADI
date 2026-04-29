import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
// import AnimatedGifFavicon from "../components/AnimatedGifFavicon";

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
  title: "Skadi - Always On. Always Closing.",
  description: "An AI voice agent that picks up every call, qualifies every lead, and books every appointment - 24 hours a day, 7 days a week.",
  // icons: {
  //   icon: { url: "/icons8-favicon-v2.gif", type: "image/gif" },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-01BZCT48LM"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-01BZCT48LM');
            `,
          }}
        />
      </head>
      <body className={`${bebasNeue.variable} ${inter.variable} font-inter bg-parchment text-obsidian font-normal`}>
        {/* <AnimatedGifFavicon gifUrl="/icons8-favicon-v2.gif" /> */}
        {children}
      </body>
    </html>
  );
}
