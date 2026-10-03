"use client";

import React from "react";
import { educationData, certificationsData, continuousReadingData } from "@/data/education";
import { GraduationCap, Award, BookOpen, ExternalLink, CheckCircle } from "lucide-react";

export function EducationSection() {
  return (
    <section id="education" className="pt-20 border-t border-border space-y-12">
      <div>
        <div className="section-label mb-2">05 | EDUCATION &amp; TRANSCRIPT</div>
        <h2 className="text-3xl md:text-5xl font-bold font-heading text-text tracking-tight">
          ACADEMIC RECORD <span className="text-accent">| COURSEWORK</span>
        </h2>
        <p className="text-sm font-mono text-text-muted mt-2 max-w-2xl">
          Foundational curriculum in computational mathematics, probability theory, stochastic calculus, and distributed systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Degree & Relevant Coursework (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {educationData.map((edu, idx) => (
            <div
              key={idx}
              className="terminal-panel p-6 bg-bg-elevated border border-border space-y-4 font-mono text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
                <div>
                  <h3 className="text-xl font-bold font-heading text-text">
                    {edu.institution}
                  </h3>
                  <div className="text-accent font-semibold text-xs mt-0.5">
                    {edu.degree} &middot; {edu.major}
                  </div>
                </div>
                <div className="text-right sm:text-right">
                  <div className="text-text font-bold text-xs">{edu.dateRange}</div>
                  <div className="text-[10px] text-text-faint">{edu.location}</div>
                </div>
              </div>

              {/* GPA Tile */}
              <div className="p-3 bg-bg-inset border border-border rounded flex items-center justify-between">
                <span className="text-text-faint uppercase text-[10px]">CUMULATIVE GPA:</span>
                <span className="text-accent font-bold text-sm tabular-nums">{edu.gpa}</span>
              </div>

              {/* Coursework Chips */}
              <div className="space-y-2 pt-2">
                <div className="text-[10px] text-text-faint uppercase">
                  Rigorous Quantitative Coursework:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {edu.coursework.map((course) => (
                    <span
                      key={course}
                      className="px-2.5 py-1 bg-bg-inset border border-border text-[11px] text-text-muted hover:text-accent hover:border-accent transition-colors rounded-sm cursor-default"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Continuous Reading / Literature List */}
          <div className="terminal-panel p-5 bg-bg-elevated border border-border space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-text font-bold uppercase">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>CONTINUOUS LEARNING &amp; LITERATURE REVIEWS</span>
            </div>

            <div className="space-y-3">
              {continuousReadingData.map((item) => (
                <div key={item.title} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-text font-medium">{item.title}</span>
                    <span className="text-text-faint text-[10px] tabular-nums">
                      {item.progressPct}% READ
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-text-faint">
                    <span>{item.author}</span>
                    <span className="uppercase text-accent font-semibold">{item.type}</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg-inset border border-border rounded overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${item.progressPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Certifications & Continuous Mastery (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="terminal-panel p-5 bg-bg-elevated border border-border font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 font-bold text-text uppercase">
                <Award className="w-4 h-4 text-accent" />
                <span>CERTIFICATIONS &amp; CREDENTIALS</span>
              </div>
              <span className="text-[10px] text-text-faint">VERIFIED</span>
            </div>

            <div className="divide-y divide-border/50">
              {certificationsData.map((cert, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text text-[11px]">{cert.name}</span>
                    <span className="text-text-faint text-[10px]">{cert.year}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-text-muted">{cert.issuer}</span>
                    {cert.verifyUrl ? (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:underline flex items-center gap-1"
                      >
                        <span>VERIFY</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-text-faint">VERIFIED</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Statement */}
          <div className="p-4 bg-bg-inset border border-border rounded font-mono text-[11px] text-text-muted leading-relaxed space-y-2">
            <div className="text-accent font-bold uppercase">PHYSICS &amp; QUANT SYNTHESIS:</div>
            <p>
              Mathematical physics curriculum (differential equations, statistical mechanics, Hamiltonian dynamics, stochastic modeling) coupled with self-directed software engineering in data structures, algorithms, and high-performance backend systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
