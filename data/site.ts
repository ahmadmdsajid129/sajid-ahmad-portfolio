export interface SiteConfig {
  name: string;
  firstName: string;
  initials: string;
  logoText: string;
  title: string;
  tagline: string;
  pitch: string;
  location: string;
  availability: string;
  availableFrom: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  liveTrackRecordEnabled: boolean;
  version: string;
  buildDate: string;
}

export const siteConfig: SiteConfig = {
  name: "Sajid Ahmad",
  firstName: "Sajid",
  initials: "SAJID",
  logoText: "SAJID // QUANT",
  title: "Sajid Ahmad // Quantitative Research & Systems",
  tagline: "I turn noisy data into testable edges.",
  pitch:
    "I build and stress-test systematic trading and risk systems: a limit-order-book simulator, a Monte Carlo derivatives pricer, and a real-time fraud engine, all open source.",
  location: "[[PLACEHOLDER: City, Country]]",
  availability: "Open to quant research / trading / dev roles",
  availableFrom: "[[PLACEHOLDER: Immediate / Q1 2027]]",
  email: "[[PLACEHOLDER: your.email@domain.com]]",
  github: "https://github.com/ahmadmdsajid129",
  linkedin: "[[PLACEHOLDER: https://linkedin.com/in/username]]",
  resumeUrl: "/resume/Ahmad_Sajid_Resume.pdf",
  liveTrackRecordEnabled: false,
  version: "1.0.0",
  buildDate: "2026-10-03",
};
