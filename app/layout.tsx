import type { Metadata } from "next";
import { Bebas_Neue, Inter, Poppins } from "next/font/google";
import Script from "next/script";
import StoreProvider from "@/lib/store/StoreProvider";
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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Skadi - AI Call Center Voice Agent & Automation",
  description: "Scale your business with AI call center voice agents. Automate customer calls, cold calling, and support with real-time voice AI.",
  metadataBase: new URL("https://theskadi.com"),
  alternates: {
    canonical: "/",
  },
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
        <meta name="google-site-verification" content="5D51veGcsxokTotZ8O8SjI9bnbHfojWUeXTVps36lX8" />
      </head>
      <body
        className={`${bebasNeue.variable} ${inter.variable} ${poppins.variable} font-inter bg-parchment text-obsidian font-normal`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-01BZCT48LM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-01BZCT48LM');
          `}
        </Script>
        {/* <AnimatedGifFavicon gifUrl="/icons8-favicon-v2.gif" /> */}
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
