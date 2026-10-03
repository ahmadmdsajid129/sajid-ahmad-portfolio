export interface EducationDegree {
  institution: string;
  degree: string;
  major: string;
  dateRange: string;
  location: string;
  gpa: string;
  coursework: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  verifyUrl?: string;
}

export interface ReadingItem {
  title: string;
  author: string;
  type: "Book" | "Paper";
  progressPct: number;
}

export const educationData: EducationDegree[] = [
  {
    institution: "[[PLACEHOLDER: Institution / University Name]]",
    degree: "Bachelor of Science",
    major: "Computer Science & Quantitative Methods [[PLACEHOLDER: confirm major]]",
    dateRange: "2021 - 2025 [[PLACEHOLDER: dates]]",
    location: "[[PLACEHOLDER: City, Country]]",
    gpa: "[[PLACEHOLDER: GPA]]",
    coursework: [
      "Probability & Stochastic Processes",
      "Linear Algebra & Matrix Decompositions",
      "Design & Analysis of Algorithms",
      "Numerical Analysis & Scientific Computing",
      "Machine Learning & Statistical Pattern Recognition",
      "Database Systems & Distributed Storage",
      "Computer Systems & Architecture",
    ],
  },
];

export const certificationsData: Certification[] = [
  {
    name: "Machine Learning Specialization",
    issuer: "DeepLearning.AI / Coursera",
    year: "2024",
    verifyUrl: "[[PLACEHOLDER: verify link]]",
  },
  {
    name: "Data Structures and Algorithms",
    issuer: "UC San Diego",
    year: "2023",
    verifyUrl: "[[PLACEHOLDER: verify link]]",
  },
  {
    name: "Financial Engineering & Risk Management",
    issuer: "Columbia University [[PLACEHOLDER: confirm]]",
    year: "2024",
    verifyUrl: "[[PLACEHOLDER: verify link]]",
  },
];

export const continuousReadingData: ReadingItem[] = [
  {
    title: "Options, Futures, and Other Derivatives",
    author: "John C. Hull",
    type: "Book",
    progressPct: 100,
  },
  {
    title: "Algorithmic and High-Frequency Trading",
    author: "Álvaro Cartea, Sebastian Jaimungal, José Penalva",
    type: "Book",
    progressPct: 90,
  },
  {
    title: "Advances in Financial Machine Learning",
    author: "Marcos López de Prado",
    type: "Book",
    progressPct: 85,
  },
  {
    title: "High-Frequency Trading in a Limit Order Book",
    author: "Marco Avellaneda & Sasha Stoikov",
    type: "Paper",
    progressPct: 100,
  },
];
