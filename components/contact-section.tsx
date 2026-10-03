"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/site";
import { useToast } from "./toast-provider";
import {
  Mail,
  Github,
  Linkedin,
  ArrowDown,
  Send,
  Check,
  Copy,
  Clock,
  MapPin,
  ExternalLink,
  Shield,
} from "lucide-react";

export function ContactSection() {
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const cleanEmail = siteConfig.email.replace("[[PLACEHOLDER: ", "").replace("]]", "");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(cleanEmail);
    setCopiedEmail(true);
    addToast("Email copied to clipboard", "success", "MAIL");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleResumeDownload = () => {
    addToast("Resume downloading...", "info", "CV");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot detected

    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast("Please fill out all required fields", "warn");
      return;
    }

    setIsSubmitting(true);

    // Fallback directly to mailto
    const mailtoUrl = `mailto:${cleanEmail}?subject=Quant Inquiry from ${encodeURIComponent(
      name
    )}&body=${encodeURIComponent(message + "\n\nFrom: " + email)}`;

    window.location.href = mailtoUrl;

    setTimeout(() => {
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setMessage("");
      addToast("Message dispatched to email client", "success", "SENT");
    }, 1000);
  };

  const pinnedRepos = [
    {
      name: "lob-alpha-simulator",
      desc: "Event-driven limit order book simulator with OBI and passive MM adverse-selection backtesting.",
      lang: "Python",
      stars: "Open Source",
      url: "https://github.com/ahmadmdsajid129/lob-alpha-simulator",
    },
    {
      name: "exotic-options-pricer",
      desc: "Vectorized Monte Carlo engine pricing exotics with variance reduction and Greeks.",
      lang: "Python / NumPy",
      stars: "Open Source",
      url: "https://github.com/ahmadmdsajid129/exotic-options-pricer",
    },
    {
      name: "real-time-payment-fraud-detection",
      desc: "Streaming fraud scoring pipeline with calibrated XGBoost, Redis ZSETs, and TreeSHAP.",
      lang: "Python / Kafka",
      stars: "61/61 Tests",
      url: "https://github.com/ahmadmdsajid129/real-time-payment-fraud-detection",
    },
    {
      name: "sajid-ahmad-portfolio",
      desc: "Quantitative research terminal website built with Next.js 14 App Router and Web Workers.",
      lang: "TypeScript",
      stars: "v1.0.0",
      url: "https://github.com/ahmadmdsajid129/sajid-ahmad-portfolio",
    },
  ];

  return (
    <section id="contact" className="pt-20 border-t border-border space-y-12">
      <div>
        <div className="section-label mb-2">06 // CONTACT &amp; DIRECTORY</div>
        <h2 className="text-3xl md:text-5xl font-bold font-heading text-text tracking-tight">
          LET&apos;S TALK <span className="text-accent">// OPEN TO WORK</span>
        </h2>
        <p className="text-sm font-mono text-text-muted mt-2 max-w-2xl">
          Available for quantitative research, algorithmic trading, and high-performance financial systems engineering roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (5 cols): Direct Contacts & Availability */}
        <div className="lg:col-span-5 space-y-6">
          <div className="terminal-panel p-6 bg-bg-elevated border border-border space-y-4 font-mono text-xs">
            <div className="text-accent font-bold uppercase text-[11px] border-b border-border pb-2">
              DIRECT REACHOUT
            </div>

            <p className="text-text-muted text-[11px] leading-relaxed">
              Recruiters and researchers can copy my direct email or schedule a technical call.
            </p>

            {/* Click to Copy Email */}
            <div className="p-3 bg-bg-inset border border-border rounded flex items-center justify-between">
              <span className="text-text font-semibold">{cleanEmail}</span>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 hover:text-accent text-text-faint transition-colors"
                title="Copy email address"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-up" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-bg-inset border border-border hover:border-accent text-text rounded flex items-center justify-center gap-2 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GITHUB</span>
              </a>

              <a
                href={siteConfig.linkedin.replace("[[PLACEHOLDER: ", "").replace("]]", "")}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-bg-inset border border-border hover:border-accent text-text rounded flex items-center justify-center gap-2 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LINKEDIN</span>
              </a>
            </div>

            {/* Third Resume Download Button */}
            <div className="pt-2 border-t border-border">
              <a
                href={siteConfig.resumeUrl}
                download
                onClick={handleResumeDownload}
                className="w-full h-11 bg-accent text-bg font-bold rounded flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all"
              >
                <span>DOWNLOAD RESUME (PDF)</span>
                <ArrowDown className="w-4 h-4" />
              </a>
              <div className="flex items-center justify-between text-[10px] text-text-faint mt-2">
                <span>PDF &middot; Updated {siteConfig.buildDate}</span>
                <a href="/resume" className="text-accent hover:underline">
                  VIEW ONLINE CV &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Availability Card */}
          <div className="terminal-panel p-4 bg-bg-inset border border-border font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-text font-bold">
              <Clock className="w-4 h-4 text-accent" />
              <span>TIMEZONE &amp; SLA</span>
            </div>
            <div className="text-[11px] text-text-muted leading-relaxed">
              Standard Response SLA: &lt; 24 business hours. Available for remote or relocation to major financial hubs.
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Terminal Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="terminal-panel p-6 bg-bg-elevated border border-border space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-border pb-2 text-[11px]">
              <span className="text-accent font-bold uppercase">&gt; DISPATCH TRANSMISSION</span>
              <span className="text-text-faint">TERMINAL MSG</span>
            </div>

            {/* Honeypot field (hidden from real users) */}
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              autoComplete="off"
            />

            <div className="space-y-1">
              <label className="text-[11px] text-text-faint flex items-center gap-1.5">
                <span className="text-accent">&gt;</span>
                <span>NAME / ORGANIZATION:</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe (Fund / Firm)"
                className="w-full p-2.5 bg-bg-inset border border-border text-text font-mono text-xs rounded focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-text-faint flex items-center gap-1.5">
                <span className="text-accent">&gt;</span>
                <span>EMAIL ADDRESS:</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@fund.com"
                className="w-full p-2.5 bg-bg-inset border border-border text-text font-mono text-xs rounded focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-text-faint flex items-center gap-1.5">
                <span className="text-accent">&gt;</span>
                <span>TRANSMISSION MESSAGE:</span>
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hello Ahmad, we reviewed your LOB and Monte Carlo tearsheets..."
                className="w-full p-2.5 bg-bg-inset border border-border text-text font-mono text-xs rounded focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-6 bg-accent text-bg font-bold rounded flex items-center gap-2 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "TRANSMITTING..." : "SEND TRANSMISSION ⏎"}</span>
            </button>
          </form>
        </div>
      </div>

      {/* GitHub Activity / Pinned Repositories Widget */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 font-bold text-text uppercase">
            <Github className="w-4 h-4 text-accent" />
            <span>PINNED REPOSITORIES // GITHUB ACTIVITY</span>
          </div>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="text-text-faint hover:text-accent transition-colors flex items-center gap-1 text-[11px]"
          >
            <span>VIEW ALL ON GITHUB</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {pinnedRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="terminal-panel p-4 bg-bg-elevated border border-border hover:border-accent transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="font-bold text-text group-hover:text-accent transition-colors truncate">
                  {repo.name}
                </div>
                <div className="text-[11px] text-text-faint mt-1 line-clamp-3 leading-relaxed">
                  {repo.desc}
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-text-faint pt-2 border-t border-border/40">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span>{repo.lang}</span>
                </span>
                <span className="text-accent">{repo.stars}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
