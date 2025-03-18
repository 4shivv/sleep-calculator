import type { Metadata } from "next";
import { Space_Grotesk, Crimson_Pro } from "next/font/google";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/crimson-pro";
import "./globals.css";
import StarryBackground from "../components/StarryBackground";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-crimson-pro",
});

export const metadata: Metadata = {
  title: "Sleep Cycle Calculator | Optimize Your Sleep and Productivity",
  description: "Scientific sleep cycle calculator to optimize your sleep schedule, productivity, and deep work times based on your chronotype and circadian rhythm.",
  keywords: [
    "sleep calculator", 
    "sleep cycle", 
    "circadian rhythm", 
    "productivity", 
    "deep work", 
    "nap time", 
    "bedtime calculator",
    "chronotype",
    "sleep science",
    "wake up time"
  ],
  authors: [{ name: "Sleep Science Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#050a24" },
    { media: "(prefers-color-scheme: dark)", color: "#050a24" }
  ],
  metadataBase: new URL("https://sleep-calculator.vercel.app"),
  openGraph: {
    title: "Sleep Cycle Calculator",
    description: "Scientific sleep cycle calculator to optimize your sleep schedule and productivity",
    type: "website",
    siteName: "Sleep Cycle Calculator",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sleep Cycle Calculator",
    description: "Scientific sleep cycle calculator to optimize your sleep schedule and productivity",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${crimsonPro.variable} antialiased transition-colors duration-300 cosmic-theme`}
      >
        <StarryBackground 
          starsCount={2000} 
          backgroundColor="#050a24" 
          shootingStarsCount={15} 
          shootingStarSpeed={0.8} 
        />
        <div className="bg-gradient-radial-subtle from-indigo-950/20 to-black/80 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
