import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/config/site";

/** Headlines only — a diploma register without tipping into ceremony. */
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Everything else. */
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/** Anything that reads like board or visa-stamp data: fees, deadlines, codes. */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gradmire — Find your course. Then find the UK around it.",
    template: "%s | Gradmire",
  },
  description:
    "Study abroad organized by subject, not by country. Compare UK master's courses on fees, entry requirements, deadlines and graduate salaries — then get a shortlist built around your subject.",
  keywords: [
    "study abroad",
    "UK masters",
    "MSc UK fees",
    "Graduate Route visa",
    "UK university rankings by subject",
    "study in the UK from India",
  ],
  openGraph: {
    type: "website",
    siteName: "Gradmire",
    url: SITE_URL,
    title: "Gradmire — Find your course. Then find the UK around it.",
    description:
      "Study abroad organized by subject, not by country. Course-first shortlists for UK master's degrees.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAF6" },
    { media: "(prefers-color-scheme: dark)", color: "#10142E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(display.variable, body.variable, mono.variable)}
    >
      <body className="min-h-screen font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
