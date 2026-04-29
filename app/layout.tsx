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
