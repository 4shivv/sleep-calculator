import type { Metadata } from "next";
import { Quicksand, Montserrat } from "next/font/google";
import "./globals.css";
import StarryBackground from "../components/StarryBackground";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Slumber | Optimize Your Sleep and Productivity",
  description: "Scientific sleep cycle calculator to optimize your sleep schedule, productivity, and deep work times based on your chronotype and circadian rhythm.",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
    shortcut: '/favicon.png'
  },
  keywords: [
    "slumber", 
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
  authors: [{ name: "Slumber Sleep Science Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#050a24" },
    { media: "(prefers-color-scheme: dark)", color: "#050a24" }
  ],
  metadataBase: new URL("https://slumber-app.vercel.app"),
  openGraph: {
    title: "Slumber",
    description: "Scientific sleep cycle calculator to optimize your sleep schedule and productivity",
    type: "website",
    siteName: "Slumber",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slumber",
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
        className={`${quicksand.variable} ${montserrat.variable} antialiased transition-colors duration-300 cosmic-theme`}
      >
        {/* StarryBackground gets added on each page */}
        <div className="bg-gradient-radial-subtle from-indigo-950/20 to-black/80 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
