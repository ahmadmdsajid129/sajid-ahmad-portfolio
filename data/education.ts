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
    institution: "Sardar Vallabhbhai National Institute of Technology, Surat (SVNIT Surat)",
    degree: "Integrated Master of Science (5-Year M.Sc.)",
    major: "Physics",
    dateRange: "2024 - 2029 (Expected) • 3rd Year / 5th Sem",
    location: "Surat, Gujarat, India",
    gpa: "7.12 / 10.0 CGPA",
    coursework: [
      "Mathematical Physics (ODEs, PDEs, Complex Analysis)",
      "Statistical Mechanics & Stochastic Thermodynamics",
      "Computational Physics & Numerical Methods",
      "Classical Mechanics & Dynamical Systems",
      "Quantum Mechanics & Linear Vector Spaces",
      "Electrodynamics & Field Theory",
      "Data Structures & Algorithms in Python",
      "Backend Engineering & Relational Database Design",
    ],
  },
];

export const certificationsData: Certification[] = [
  {
    name: "The Complete Data Structures and Algorithms Course in Python",
    issuer: "Udemy (Elshad Karimov) • 46.5 hrs",
    year: "2025",
    verifyUrl: "https://www.udemy.com/certificate/UC-51e18fa4-2106-4b9e-a7d1-bf0e0791d725/",
  },
  {
    name: "Introduction to Back-End Development",
    issuer: "Meta / Coursera",
    year: "2025",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/SOHOCWKF6QUL",
  },
  {
    name: "Python Django - The Practical Guide",
    issuer: "Udemy (Maximilian Schwarzmüller) • 23 hrs",
    year: "2025",
    verifyUrl: "https://www.udemy.com/certificate/UC-83ac043e-8cd1-4a5e-b401-d14bee474a48/",
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
