export type Country = {
  slug: string;
  name: string;
  shortLabel: string;
  live: boolean;
  heroStat: string;
  whyStudyHere: string[];
  visaProgramName: string;
  visaProgramDetail: string;
  flagEmoji: string;
};

export const countries: Country[] = [
  {
    slug: "uk",
    name: "United Kingdom",
    shortLabel: "UK",
    live: true,
    flagEmoji: "🇬🇧",
    heroStat: "1-year master's degrees",
    whyStudyHere: [
      "1-year master's degrees — save a year of time and cost vs. the US or Canada",
      "Graduate Route visa — up to 2 years post-study work (3 for PhD)",
      "4 of the world's top 10 universities",
      "Teaching-intensive courses with strong industry links",
    ],
    visaProgramName: "Graduate Route",
    visaProgramDetail: "Up to 2 years post-study work (3 for PhD)",
  },
  {
    slug: "us",
    name: "United States",
    shortLabel: "US",
    live: false,
    flagEmoji: "🇺🇸",
    heroStat: "World's largest higher education system",
    whyStudyHere: [
      "Unmatched research funding and lab facilities",
      "OPT visa — up to 3 years post-study work for STEM",
      "Flexible curriculum with major/minor systems",
    ],
    visaProgramName: "OPT",
    visaProgramDetail: "Up to 12 months (36 for STEM)",
  },
  {
    slug: "canada",
    name: "Canada",
    shortLabel: "CA",
    live: false,
    flagEmoji: "🇨🇦",
    heroStat: "Pathway to permanent residency",
    whyStudyHere: [
      "Post-Graduation Work Permit up to 3 years",
      "Lower tuition than the US for comparable quality",
      "Strong immigration-friendly policies for graduates",
    ],
    visaProgramName: "PGWP",
    visaProgramDetail: "Up to 3 years post-study work",
  },
  {
    slug: "australia",
    name: "Australia",
    shortLabel: "AU",
    live: false,
    flagEmoji: "🇦🇺",
    heroStat: "Top 5 international student destination",
    whyStudyHere: [
      "Post-Study Work visa up to 4 years for master's",
      "High quality of life and multicultural campuses",
      "Growing tech and renewable energy sectors",
    ],
    visaProgramName: "Post-Study Work Visa",
    visaProgramDetail: "Up to 4 years for master's graduates",
  },
];

export function getCountry(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}

export function getLiveCountries(): Country[] {
  return countries.filter((c) => c.live);
}

export function getAllCountries(): Country[] {
  return countries;
}

export function getComingSoonCountries(): Country[] {
  return countries.filter((c) => !c.live);
}
