export interface SiteConfig {
  name: string;
  firstName: string;
  initials: string;
  logoText: string;
  title: string;
  tagline: string;
  pitch: string;
  location: string;
  phone: string;
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
  name: "MD SAJID AHMAD",
  firstName: "Sajid",
  initials: "SAJID",
  logoText: "SAJID | QUANT",
  title: "MD SAJID AHMAD | Quantitative Research & Systems",
  tagline: "I turn noisy data into testable edges.",
  pitch:
    "I build and stress-test systematic trading and risk systems: a limit-order-book simulator, a Monte Carlo derivatives pricer, and a real-time fraud engine, all open source.",
  location: "Surat, Gujarat, India",
  phone: "+91 7970872205",
  availability: "Open to quant research / trading / dev roles",
  availableFrom: "Immediate / 2026",
  email: "ahmadmdsajid129@gmail.com",
  github: "https://github.com/ahmadmdsajid129",
  linkedin: "https://www.linkedin.com/in/md-sajid-ahmad-350a9b32a/",
  resumeUrl: "/resume/Ahmad_Sajid_Resume.pdf",
  liveTrackRecordEnabled: false,
  version: "1.0.0",
  buildDate: "2026-10-03",
};
