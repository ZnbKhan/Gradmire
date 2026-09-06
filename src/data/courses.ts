export type University = {
  name: string;
  notableFor: string;
  subjectRank?: string;
};

export type CourseHub = {
  countrySlug: string;
  slug: string;
  name: string;
  icon: string; // lucide icon name
  oneLiner: string;
  overview?: string;
  universities?: University[];
  /** ISO 4217 code. Only reliably present on DB-backed hubs — see tool-data.ts. */
  currency?: string;
  /**
   * Raw figures behind `tuitionRange`, for anything that does arithmetic
   * (the ROI calculator) rather than just displaying the range. Regex-
   * parsing the formatted string back into numbers is what this replaces —
   * that broke silently the moment the format or currency symbol changed.
   */
  tuitionMin?: number;
  tuitionMax?: number;
  tuitionRange?: string;
  livingCostMin?: number;
  livingCostMax?: number;
  livingCosts?: string;
  entryRequirements?: string[];
  applicationDeadlines?: { label: string; detail: string }[];
  deadlineWarning?: string;
  salaryMin?: number;
  salaryMax?: number;
  medianSalaryRange?: string;
  salaryProgressionOneYear?: string;
  salaryProgressionThreeYear?: string;
  salaryProgressionFiveYear?: string;
  topSectors?: string[];
  commonEmployers?: string[];
  visaNotes?: string[];
  atasRequired?: boolean;
  extraNote?: string;
  isStub: boolean;
};

export const courseHubs: CourseHub[] = [
  // ══════════════════════════════════════════
  // UK — FULLY SPECIFIED HUBS
  // ══════════════════════════════════════════
  {
    countrySlug: "uk",
    slug: "business-management",
    name: "Business & Management",
    icon: "Briefcase",
    isStub: false,
    oneLiner:
      "From MBAs to specialist Master's in Finance and Marketing, the UK offers some of the most respected business education in the world — often completed in a single year.",
    overview:
      "UK business degrees are known for rigor, strong industry partnerships, and short duration. Most Master's programs run 12 months. Popular specializations: MBA, MSc Finance, MSc Marketing, MSc Management, MSc HR, MSc Business Analytics.",
    universities: [
      {
        name: "London Business School",
        notableFor: "MBA, Finance",
        subjectRank: "Top 3",
      },
      {
        name: "University of Oxford Saïd",
        notableFor: "MBA, Strategy",
        subjectRank: "Top 5",
      },
      {
        name: "University of Cambridge Judge",
        notableFor: "MBA, Entrepreneurship",
        subjectRank: "Top 5",
      },
      {
        name: "Imperial College London",
        notableFor: "Finance, Analytics",
        subjectRank: "Top 8",
      },
      {
        name: "University of Warwick WBS",
        notableFor: "Marketing, Management",
        subjectRank: "Top 10",
      },
      {
        name: "University of Bath",
        notableFor: "Management, HR",
        subjectRank: "Top 15",
      },
    ],
    tuitionMin: 22000,
    tuitionMax: 95000,
    tuitionRange: "£22,000–£95,000/year",
    livingCostMin: 1100,
    livingCostMax: 1500,
    livingCosts: "£1,100–£1,500/month",
    currency: "GBP",
    entryRequirements: [
      "2:1 UK equivalent (60%+ Indian universities, varies by institution)",
      "IELTS 6.5–7.5",
      "Work experience required for most MBAs (2-5 years), not for MSc",
      "GMAT/GRE often required for MBA, sometimes waived for strong MSc academics",
    ],
    applicationDeadlines: [
      {
        label: "MBA",
        detail: "Rolling rounds October–April",
      },
      {
        label: "MSc",
        detail: "January–March for September intake",
      },
    ],
    deadlineWarning:
      "Oxford/Cambridge MBA and highly competitive MSc may close by January.",
    salaryMin: 38000,
    salaryMax: 65000,
    medianSalaryRange: "£38,000–£65,000",
    salaryProgressionOneYear: "£42,000–£75,000",
    salaryProgressionThreeYear: "£52,000–£95,000",
    salaryProgressionFiveYear: "£65,000–£130,000",
    topSectors: [
      "Consulting",
      "Investment Banking",
      "Consumer Goods",
      "Tech",
    ],
    commonEmployers: ["Deloitte", "EY", "JP Morgan", "Unilever", "Amazon"],
    visaNotes: [
      "Graduate Route visa: 2 years post-study work",
      "No ATAS clearance required for standard business courses",
    ],
    atasRequired: false,
    extraNote:
      "Look for Triple Crown accreditation (AACSB, AMBA, EQUIS) — LBS, Warwick and others hold this.",
  },
  {
    countrySlug: "uk",
    slug: "computer-science-ai-data-science",
    name: "Computer Science, AI & Data Science",
    icon: "Cpu",
    isStub: false,
    oneLiner:
      "Home to some of Europe's strongest CS research departments and a fast-growing tech job market, especially in London, Cambridge, and Edinburgh.",
    overview:
      "Ranges from broad MSc CS conversion courses (for non-CS undergrads) to specialized AI/ML/Data Science Master's, many with industry placement years.",
    universities: [
      {
        name: "University of Cambridge",
        notableFor: "AI/ML, Theoretical CS",
      },
      {
        name: "University of Oxford",
        notableFor: "AI, Software Engineering",
      },
      {
        name: "Imperial College London",
        notableFor: "AI, Computing, Fintech",
      },
      { name: "UCL", notableFor: "Data Science, AI" },
      {
        name: "University of Edinburgh",
        notableFor: "AI, Informatics — largest CS dept in UK",
      },
      {
        name: "University of Manchester",
        notableFor: "Data Science, CS",
      },
    ],
    tuitionMin: 24000,
    tuitionMax: 45000,
    tuitionRange: "£24,000–£45,000/year",
    livingCostMin: 1000,
    livingCostMax: 1600,
    livingCosts: "£1,000–£1,600/month",
    currency: "GBP",
    entryRequirements: [
      "2:1 equivalent in relevant discipline",
      "Conversion courses often accept strong quantitative degrees",
      "IELTS 6.5–7.0",
      "Programming background required for specialized AI/ML, not for conversion MSc",
    ],
    applicationDeadlines: [
      {
        label: "Most programmes",
        detail: "January–April for September intake",
      },
    ],
    deadlineWarning:
      "Cambridge/Oxford/Imperial AI/ML often fill by January–February.",
    salaryMin: 35000,
    salaryMax: 55000,
    medianSalaryRange: "£35,000–£55,000",
    salaryProgressionOneYear: "£42,000–£68,000",
    salaryProgressionThreeYear: "£55,000–£90,000",
    salaryProgressionFiveYear: "£70,000–£130,000",
    topSectors: ["Tech", "Fintech", "Consulting", "AI Startups"],
    commonEmployers: [
      "Google",
      "Meta",
      "DeepMind",
      "Revolut",
      "Big 4 tech consulting arms",
    ],
    visaNotes: [
      "Graduate Route visa: 2 years post-study work",
      "ATAS may be required for some AI/ML and advanced computing courses (check per course — can add 4-6 weeks)",
    ],
    atasRequired: true,
    extraNote: undefined,
  },
  {
    countrySlug: "uk",
    slug: "engineering-technology",
    name: "Engineering & Technology",
    icon: "Wrench",
    isStub: false,
    oneLiner:
      "Strong in mechanical, civil, electrical, and increasingly renewable/clean energy engineering, with close ties to UK industry and infrastructure projects.",
    overview:
      "MSc programs typically 1 year, applied/industry-relevant. Specializations: Mechanical, Civil, Electrical & Electronic, Aerospace, Renewable Energy Engineering.",
    universities: [
      {
        name: "University of Cambridge",
        notableFor: "General Engineering, Aerospace",
      },
      {
        name: "Imperial College London",
        notableFor: "Mechanical, Electrical, Aeronautics",
      },
      {
        name: "University of Manchester",
        notableFor: "Chemical, Civil",
      },
      {
        name: "University of Southampton",
        notableFor: "Aerospace, Acoustics",
      },
      {
        name: "University of Leeds",
        notableFor: "Civil, Mechanical",
      },
      {
        name: "University of Strathclyde",
        notableFor: "Renewable Energy, Naval Architecture",
      },
    ],
    tuitionMin: 24000,
    tuitionMax: 38000,
    tuitionRange: "£24,000–£38,000/year",
    livingCostMin: 1000,
    livingCostMax: 1400,
    livingCosts: "£1,000–£1,400/month",
    currency: "GBP",
    entryRequirements: [
      "2:1 in relevant engineering discipline",
      "IELTS 6.5",
      "Some courses require specific undergrad prerequisites (core math/physics modules)",
    ],
    applicationDeadlines: [
      {
        label: "Most programmes",
        detail:
          "January–May for September intake (later than Business/CS generally, but competitive courses fill earlier)",
      },
    ],
    deadlineWarning: undefined,
    salaryMin: 32000,
    salaryMax: 48000,
    medianSalaryRange: "£32,000–£48,000",
    salaryProgressionOneYear: "£36,000–£56,000",
    salaryProgressionThreeYear: "£45,000–£72,000",
    salaryProgressionFiveYear: "£58,000–£95,000",
    topSectors: ["Infrastructure", "Automotive", "Aerospace", "Energy"],
    commonEmployers: [
      "Rolls-Royce",
      "Arup",
      "National Grid",
      "BAE Systems",
    ],
    visaNotes: [
      "Graduate Route visa: 2 years post-study work",
      "ATAS required for most engineering courses involving sensitive technologies (aerospace, nuclear, certain materials science) — apply as early as possible",
    ],
    atasRequired: true,
    extraNote: undefined,
  },

  {
    countrySlug: "uk",
    slug: "medicine-nursing-health",
    name: "Medicine, Nursing & Health Sciences",
    icon: "Heart",
    isStub: false,
    oneLiner:
      "World-renowned medical schools, NHS clinical placements, and globally recognized qualifications.",
    overview:
      "UK healthcare degrees range from postgraduate clinical qualifications (MSc Nursing, MSc Radiography) to research-focused MPhil programmes. Most taught courses run 12-24 months. Strong emphasis on NHS partnerships, clinical placements, and research opportunities. Popular specializations: MSc Nursing, MSc Public Health, MSc Clinical Psychology, MSc Healthcare Management, MSc Radiotherapy & Oncology.",
    universities: [
      {
        name: "University of Cambridge",
        notableFor: "Medicine, Public Health",
        subjectRank: "Top 5",
      },
      {
        name: "University of Oxford",
        notableFor: "Medicine, Clinical Research",
        subjectRank: "Top 5",
      },
      {
        name: "Imperial College London",
        notableFor: "Medicine, Biomedical Sciences",
        subjectRank: "Top 8",
      },
      {
        name: "University College London (UCL)",
        notableFor: "Nursing, Public Health, Healthcare Management",
        subjectRank: "Top 10",
      },
      {
        name: "University of Edinburgh",
        notableFor: "Medicine, Nursing, Medical Research",
        subjectRank: "Top 10",
      },
      {
        name: "University of Manchester",
        notableFor: "Nursing, Public Health, Clinical Research",
        subjectRank: "Top 15",
      },
    ],
    tuitionMin: 20000,
    tuitionMax: 50000,
    tuitionRange: "£20,000–£50,000/year",
    livingCostMin: 1100,
    livingCostMax: 1500,
    livingCosts: "£1,100–£1,500/month",
    currency: "GBP",
    entryRequirements: [
      "2:1 UK equivalent (60%+ from Indian universities, varies by institution)",
      "IELTS 7.0–7.5",
      "For clinical programmes: healthcare experience or background strongly preferred",
      "For nursing MSc: often require RN/nursing registration from home country",
      "GMAT/GRE not typically required for health sciences",
    ],
    applicationDeadlines: [
      {
        label: "Most programmes",
        detail: "January–April for September intake",
      },
      {
        label: "Competitive clinical MSc",
        detail: "November–December for September intake",
      },
    ],
    deadlineWarning:
      "Cambridge/Oxford medicine and clinical MSc programs may close by December.",
    salaryMin: 30000,
    salaryMax: 52000,
    medianSalaryRange: "£30,000–£52,000",
    salaryProgressionOneYear: "£32,000–£58,000",
    salaryProgressionThreeYear: "£38,000–£72,000",
    salaryProgressionFiveYear: "£45,000–£90,000",
    topSectors: ["NHS", "Private Healthcare", "Public Health", "Medical Research"],
    commonEmployers: ["NHS Trusts", "Roche", "AstraZeneca", "GSK", "Barts Health NHS"],
    visaNotes: [
      "Graduate Route visa: 2-3 years post-study work (extended for healthcare professionals)",
      "ATAS may be required for some clinical/medical research courses",
      "NHS registration/license process for clinical roles may extend timeline 6-12 months",
    ],
    atasRequired: true,
    extraNote:
      "UK registration bodies (NMC for nurses, GMC for doctors) require additional qualifications beyond degree.",
  },

  // ══════════════════════════════════════════
  // UK — STUB HUBS
  // ══════════════════════════════════════════
  {
    countrySlug: "uk",
    slug: "law",
    name: "Law",
    icon: "Scale",
    isStub: true,
    oneLiner:
      "Study in one of the world's most influential legal systems, with access to top law firms and the Inns of Court.",
    salaryMin: 40000,
    salaryMax: 70000,
    medianSalaryRange: "£40,000–£70,000",
    salaryProgressionOneYear: "£48,000–£85,000",
    salaryProgressionThreeYear: "£65,000–£120,000",
    salaryProgressionFiveYear: "£85,000–£180,000",
    topSectors: ["Law Firms", "In-House Counsel", "Public Sector", "Tech"],
    commonEmployers: ["Slaughter and May", "Freshfields", "Linklaters", "Allen & Overy"],
  },
  {
    countrySlug: "uk",
    slug: "architecture-design",
    name: "Architecture & Design",
    icon: "PenTool",
    isStub: true,
    oneLiner:
      "From the Bartlett to the AA, the UK is home to some of the world's most prestigious architecture and design schools.",
    salaryMin: 28000,
    salaryMax: 45000,
    medianSalaryRange: "£28,000–£45,000",
    salaryProgressionOneYear: "£32,000–£52,000",
    salaryProgressionThreeYear: "£42,000–£68,000",
    salaryProgressionFiveYear: "£55,000–£95,000",
    topSectors: ["Architecture", "Urban Planning", "Design Consultancies", "Tech"],
    commonEmployers: ["Zaha Hadid Architects", "Foster + Partners", "Pentagram", "Studiolight"],
  },
  {
    countrySlug: "uk",
    slug: "economics",
    name: "Economics",
    icon: "TrendingUp",
    isStub: true,
    oneLiner:
      "Strong quantitative training with pathways into finance, policy, and consulting at top departments like LSE and Warwick.",
    salaryMin: 38000,
    salaryMax: 62000,
    medianSalaryRange: "£38,000–£62,000",
    salaryProgressionOneYear: "£44,000–£75,000",
    salaryProgressionThreeYear: "£56,000–£100,000",
    salaryProgressionFiveYear: "£72,000–£140,000",
    topSectors: ["Finance", "Consulting", "Public Sector", "Central Banks"],
    commonEmployers: ["Bank of England", "IMF", "World Bank", "McKinsey", "Goldman Sachs"],
  },
  {
    countrySlug: "uk",
    slug: "psychology",
    name: "Psychology",
    icon: "Brain",
    isStub: true,
    oneLiner:
      "BPS-accredited programmes with research-intensive training and clinical placement opportunities.",
    salaryMin: 26000,
    salaryMax: 42000,
    medianSalaryRange: "£26,000–£42,000",
    salaryProgressionOneYear: "£29,000–£48,000",
    salaryProgressionThreeYear: "£35,000–£60,000",
    salaryProgressionFiveYear: "£45,000–£80,000",
    topSectors: ["Mental Health Services", "Research", "Corporate Wellness", "Tech"],
    commonEmployers: ["NHS Mental Health Trusts", "University Departments", "Google", "Facebook"],
  },
];

export function getCoursesByCountry(countrySlug: string): CourseHub[] {
  return courseHubs.filter((c) => c.countrySlug === countrySlug);
}

export function getCourse(
  countrySlug: string,
  courseSlug: string
): CourseHub | undefined {
  return courseHubs.find(
    (c) => c.countrySlug === countrySlug && c.slug === courseSlug
  );
}

export function getAllLiveCourses(): CourseHub[] {
  // Returns courses from all live countries
  // For now only UK, but this automatically includes future live countries
  return courseHubs;
}

export function getFullCourseHubs(countrySlug?: string): CourseHub[] {
  const hubs = countrySlug
    ? courseHubs.filter((c) => c.countrySlug === countrySlug)
    : courseHubs;
  return hubs.filter((c) => !c.isStub);
}
