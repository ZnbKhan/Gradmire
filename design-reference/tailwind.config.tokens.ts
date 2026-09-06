// Gradmire design tokens — merge this `extend` block into your existing tailwind.config.ts
// Fonts: add to app/layout.tsx  ->  Fraunces (display), Inter (body), IBM_Plex_Mono (data/labels)
//
// import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
// const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["400","500","600","700"] });
// const inter = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["400","500","600","700","800"] });
// const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400","500","600"] });
// -> apply `${fraunces.variable} ${inter.variable} ${mono.variable}` on <body>

export const gradmireTailwindExtend = {
  colors: {
    ink: {
      DEFAULT: "#10142E", // primary text / dark surfaces
      2: "#181D45",
      3: "#252B63",
      soft: "rgba(16,20,46,0.62)",
    },
    paper: {
      DEFAULT: "#FBFAF6", // page background
      dim: "#F1EEE4",     // section alt background
    },
    line: "#DEDACB",
    coral: {
      DEFAULT: "#E4390E", // primary accent / CTAs
      dim: "#FDE3D9",
    },
    gold: "#C89A2E",      // highlight accent (stats, badges)
    green: {
      DEFAULT: "#1B6E52", // secondary accent (spotlight, success states)
      dim: "#DCEDE4",
    },
  },
  fontFamily: {
    display: ["var(--font-display)", "Georgia", "serif"],  // Fraunces — headlines only
    sans: ["var(--font-body)", "system-ui", "sans-serif"], // Inter — everything else
    mono: ["var(--font-mono)", "monospace"],                // IBM Plex Mono — data, labels, deadlines
  },
  borderRadius: {
    card: "16px",
    pill: "999px",
  },
  boxShadow: {
    card: "0 1px 0 rgba(16,20,46,0.05), 0 12px 24px -16px rgba(16,20,46,0.25)",
  },
};

/*
DESIGN RATIONALE
-----------------
Signature idea: an airport "departures board" for course subjects, and boarding-pass
shaped cards for individual programmes. It's literal to the study-abroad "destination"
metaphor Gradmire's copy already uses, and it's not a look any competitor in this space
(gostudyin.com included) is using — they lean on generic travel photography instead.

Palette: deep ink-navy + warm paper background, with coral as the one CTA/accent color,
gold for data highlights, and green reserved for the "trending" / success moments.
Avoids the cream+terracotta combo (overused in AI-generated design) by keeping the accent
saturated and singular rather than a muted single-tone wash.

Type: Fraunces (serif with real character, used ONLY for headlines — evokes a diploma/
certificate register without tipping into wedding-invite territory) + Inter for all UI
and body copy + IBM Plex Mono for anything that reads like flight-board or visa-stamp
data: deadlines, fees, subject codes, rankings.
*/
