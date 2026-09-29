export const groups = [
  {
    name: "Institute",
    path: "/about",
    links: [
      ["At a glance", "/about/at-a-glance"],
      ["Director’s desk", "/about/directorate"],
      ["Founding director", "/about/founding-director"],
      ["Governance", "/governance"],
      ["RTI & disclosures", "/statutory/rti"],
      ["NIRF", "/statutory/nirf"],
    ],
  },
  {
    name: "Academics",
    path: "/academics",
    links: [
      ["Programs", "/academics"],
      ["Course explorer", "/academics/course-structure"],
      ["Academic calendar", "/academics/calendar"],
      ["Fees & scholarships", "/academics/fees"],
      ["Official forms", "/forms"],
    ],
  },
  {
    name: "Admissions",
    path: "/admissions",
    links: [
      ["Undergraduate admissions", "/admissions/undergraduate"],
      ["Postgraduate admissions", "/admissions/postgraduate"],
      ["Doctoral admissions", "/academics/phd"],
      ["Ask admissions", "/contact"],
    ],
  },
  {
    name: "Research",
    path: "/research",
    links: [
      ["Research & innovation", "/research"],
      ["CDSAI", "/research/cdsai"],
      ["WCARL", "/research/wcarl"],
      ["CREATE incubation", "/research/create"],
      ["Publications", "/research/publications"],
    ],
  },
  {
    name: "Campus life",
    path: "/campus-life",
    links: [
      ["Life at IIITL", "/campus-life"],
      ["Clubs & societies", "/campus-life/clubs"],
      ["Hostels & mess", "/campus-life/hostels"],
      ["Counselling", "/campus-life/counselling"],
      ["Gallery", "/campus-life/gallery"],
    ],
  },
  {
    name: "People",
    path: "/people/faculty",
    links: [
      ["Faculty", "/people/faculty"],
      ["Staff", "/people/staff"],
      ["Research scholars", "/people/research-scholars"],
      ["Alumni", "/people/alumni"],
    ],
  },
  {
    name: "Opportunities",
    path: "/placements",
    links: [
      ["Placements", "/placements"],
      ["Careers", "/careers"],
      ["Tenders", "/tenders"],
      ["News & events", "/news"],
      ["Contact & visit", "/contact"],
    ],
  },
];
export const programs = [
  {
    code: "cs",
    name: "Computer Science",
    degree: "B.Tech",
    level: "Undergraduate",
    duration: 4,
    description:
      "Build a strong foundation in algorithms, computing systems, and the ideas that move technology forward.",
  },
  {
    code: "csai",
    name: "Computer Science & Artificial Intelligence",
    degree: "B.Tech",
    level: "Undergraduate",
    duration: 4,
    description:
      "Explore intelligent systems, machine learning, and the mathematical foundations of AI.",
  },
  {
    code: "it",
    name: "Information Technology",
    degree: "B.Tech",
    level: "Undergraduate",
    duration: 4,
    description:
      "Connect software, networks, and people through thoughtfully engineered information systems.",
  },
  {
    code: "csb",
    name: "Computer Science & Business",
    degree: "B.Tech",
    level: "Undergraduate",
    duration: 4,
    description:
      "Bring computational thinking to business, entrepreneurship, and digital enterprises.",
  },
  {
    code: "mtech-cs",
    name: "Computer Science",
    degree: "M.Tech",
    level: "Postgraduate",
    duration: 2,
    description:
      "Deepen your expertise through advanced computing coursework and research.",
  },
  {
    code: "mba",
    name: "Digital Business",
    degree: "MBA",
    level: "Postgraduate",
    duration: 2,
    description:
      "Lead at the intersection of management, digital technology, and innovation.",
  },
  {
    code: "data-science",
    name: "Data Science",
    degree: "M.Sc",
    level: "Postgraduate",
    duration: 2,
    description:
      "Turn complex data into useful insight with statistics, computation, and machine learning.",
  },
  {
    code: "ai-ml",
    name: "Artificial Intelligence & Machine Learning",
    degree: "M.Sc",
    level: "Postgraduate",
    duration: 2,
    description: "Study the methods behind modern intelligent systems.",
  },
  {
    code: "economics",
    name: "Economics & Management",
    degree: "M.Sc",
    level: "Postgraduate",
    duration: 2,
    description: "Examine markets, quantitative economics, and management.",
  },
  {
    code: "phd",
    name: "Doctoral research",
    degree: "PhD",
    level: "Doctoral",
    duration: 3,
    description:
      "Pursue original questions with faculty across computing and allied disciplines.",
  },
];
export const programPath = (p: (typeof programs)[number]) =>
  p.code === "phd"
    ? "/academics/phd"
    : `/academics/${p.level.toLowerCase()}/${p.code}`;
export const aliases: Record<string, string> = {
  "/about/directorate": "directorate",
  "/about/founding-director": "founding-director-message",
  "/about/at-a-glance": "at-a-glance",
  "/governance/board-of-governors": "board-of-governors",
  "/governance/senate": "senate",
  "/governance/finance-committee": "finance-committee",
  "/governance/building-works": "building-works-committee",
  "/governance/rajbhasha": "rajbhashaa",
  "/governance/icc": "internal-complaints-committee-icc",
  "/governance/disciplinary": "disciplinary-committee",
  "/governance/anti-ragging": "anti-ragging-committee-squad",
  "/governance/sgrc": "sgrc",
  "/statutory/rti": "rti",
  "/forms": "official-forms-format",
  "/academics/fees": "fee-structure",
  "/campus-life/hostels": "hostel-rules",
  "/people/staff": "officer-staff",
  "/people/research-scholars": "research-scholars",
  "/people/alumni": "alumni",
  "/research/cdsai": "cdsai",
  "/media": "media-coverage",
};
export const committees = [
  "Board of Governors",
  "Senate",
  "Finance Committee",
  "Building Works",
  "Rajbhasha",
  "ICC",
  "Disciplinary",
  "Anti Ragging",
  "SGRC",
];
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const roles = [
  "Student",
  "Faculty",
  "Exam Cell",
  "Accounts",
  "Registrar",
  "Institute Admin",
  "Super Admin",
] as const;
export type Role = (typeof roles)[number];
export const stages = [
  "Academic Section",
  "Central Library",
  "Computer Labs",
  "Hostel Warden",
  "Mess Contractor",
  "Sports Officer",
  "Accounts Section",
];
export const courses = [
  {
    code: "CS301",
    name: "Design & Analysis of Algorithms",
    credits: 5,
    ltp: "3–1–2",
    area: "Core",
    prerequisite: "Data Structures",
    description:
      "Algorithm analysis, divide and conquer, greedy methods, dynamic programming, and graph algorithms.",
  },
  {
    code: "CS302",
    name: "Database Management Systems",
    credits: 4,
    ltp: "3–0–2",
    area: "Core",
    prerequisite: "Programming fundamentals",
    description:
      "Relational models, SQL, normalization, transactions, indexing, and database design.",
  },
  {
    code: "CS303",
    name: "Operating Systems",
    credits: 4,
    ltp: "3–0–2",
    area: "Core",
    prerequisite: "Computer organization",
    description:
      "Processes, concurrency, memory management, storage, and file systems.",
  },
  {
    code: "MA301",
    name: "Probability & Statistics",
    credits: 4,
    ltp: "3–1–0",
    area: "Core",
    prerequisite: "Calculus",
    description:
      "Probability distributions, estimation, testing, and statistical inference.",
  },
  {
    code: "AI301",
    name: "Foundations of Machine Learning",
    credits: 4,
    ltp: "3–0–2",
    area: "Elective",
    prerequisite: "Linear algebra",
    description:
      "Supervised and unsupervised learning, evaluation, regression, and classification.",
  },
];
