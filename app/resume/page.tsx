"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { projectsData } from "@/data/projects";
import { educationData } from "@/data/education";
import { experienceData } from "@/data/experience";
import { skillsData } from "@/data/skills";
import { ArrowLeft, Printer, Download } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="py-10 max-w-[850px] mx-auto font-sans text-text">
      {/* Top action bar - Hidden when printed */}
      <div className="flex items-center justify-between font-mono text-xs border-b border-border pb-4 mb-8 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-accent hover:underline font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; BACK TO DASHBOARD</span>
        </Link>
        <div className="flex items-center gap-3">
          <a
            href={siteConfig.resumeUrl}
            download
            className="px-3 py-1.5 bg-bg-elevated border border-border text-text hover:text-accent rounded flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD PDF</span>
          </a>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-accent text-bg font-bold rounded flex items-center gap-1.5 hover:brightness-110 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT CV (A4)</span>
          </button>
        </div>
      </div>

      {/* CV Paper Container */}
      <div className="terminal-panel p-8 sm:p-12 bg-bg-elevated border border-border print:border-none print:bg-white print:text-black print:p-0 space-y-8 font-sans">
        {/* Header */}
        <header className="border-b border-border print:border-gray-300 pb-6 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-3xl font-bold font-heading text-text print:text-black tracking-tight">
              {siteConfig.name.replace("[[PLACEHOLDER: ", "").replace("]]", "")}
            </h1>
            <div className="font-mono text-xs text-accent print:text-gray-700">
              Quantitative Researcher &amp; Systems Engineer
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-muted print:text-gray-600 pt-1">
            <span>{siteConfig.location}</span>
            <span>&bull;</span>
            <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="hover:text-accent print:text-gray-700">
              {siteConfig.phone}
            </a>
            <span>&bull;</span>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-accent print:text-gray-700">
              {siteConfig.email}
            </a>
            <span>&bull;</span>
            <a href={siteConfig.github} target="_blank" rel="noreferrer" className="underline hover:text-accent">
              github.com/ahmadmdsajid129
            </a>
            <span>&bull;</span>
            <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" className="underline hover:text-accent">
              linkedin.com/in/md-sajid-ahmad-350a9b32a
            </a>
          </div>
        </header>

        {/* Core Competencies */}
        <section className="space-y-2 font-mono text-xs">
          <h2 className="text-xs font-bold text-accent print:text-black uppercase tracking-wider border-b border-border/40 pb-1">
            Core Competencies &amp; Technical Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-muted print:text-gray-700 leading-relaxed font-sans text-xs">
            <div>
              <strong>Quant &amp; Modeling:</strong> Monte Carlo Simulation, Geometric Brownian Motion,
              Variance Reduction (Antithetic, Control Variates), Greeks (Finite Difference, CRN),
              Market Microstructure (OBI, Queue Modeling, Adverse Selection).
            </div>
            <div>
              <strong>Software &amp; Systems:</strong> Python (NumPy, SciPy, Pandas, scikit-learn, XGBoost),
              FastAPI, Redis (Sliding Windows, Cache-Aside), Kafka, Next.js 14, TypeScript, Docker, SQL/PostgreSQL, MongoDB.
            </div>
          </div>
        </section>

        {/* Flagship Projects */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-accent print:text-black uppercase tracking-wider border-b border-border/40 pb-1 font-mono">
            Flagship Quantitative &amp; ML Projects
          </h2>

          <div className="space-y-4 text-xs">
            {projectsData.map((project) => (
              <div key={project.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-mono">
                  <div className="font-bold text-sm text-text print:text-black">
                    {project.title}{" "}
                    <span className="text-[10px] text-accent print:text-gray-600">[{project.code}]</span>
                  </div>
                  <div className="text-text-faint print:text-gray-500 text-[11px]">
                    {project.dateRange}
                  </div>
                </div>
                <p className="text-text-muted print:text-gray-700 leading-relaxed">
                  {project.oneLiner}
                </p>
                <div className="font-mono text-[10px] text-text-faint print:text-gray-600">
                  Metrics: {project.metrics.map((m) => `${m.label}: ${m.value}`).join(" | ")}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-accent print:text-black uppercase tracking-wider border-b border-border/40 pb-1 font-mono">
            Engineering Experience
          </h2>

          <div className="space-y-4 text-xs">
            {experienceData.map((exp) => (
              <div key={exp.id} className="space-y-1.5">
                <div className="flex justify-between items-baseline font-mono">
                  <div className="font-bold text-text print:text-black text-sm">
                    {exp.role} &middot;{" "}
                    <span className="text-accent print:text-gray-700">{exp.organization}</span>
                  </div>
                  <div className="text-text-faint print:text-gray-500 text-[11px]">
                    {exp.dateRange}
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1 text-text-muted print:text-gray-700 leading-relaxed">
                  {exp.bullets.slice(0, 4).map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold text-accent print:text-black uppercase tracking-wider border-b border-border/40 pb-1 font-mono">
            Education
          </h2>

          {educationData.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline text-xs font-mono">
              <div>
                <span className="font-bold text-text print:text-black">{edu.institution}</span> &mdash;{" "}
                <span className="text-text-muted print:text-gray-700">
                  {edu.degree}, {edu.major}
                </span>
              </div>
              <div className="text-text-faint print:text-gray-500">{edu.dateRange}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
