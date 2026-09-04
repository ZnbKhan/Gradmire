import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/config/site";

/**
 * One typeface, Poppins, across the whole site. All three roles (display,
 * body, mono) point at the same font family so `font-display`/`font-sans`/
 * `font-mono` keep working everywhere without touching every call site.
 */
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en" className={poppins.variable}>
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
