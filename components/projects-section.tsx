"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData, ProjectType, ProjectData } from "@/data/projects";
import { ProjectCardVisual } from "./project-card-visual";
import { ArrowRight, ExternalLink, ShieldCheck, AlertCircle, Sparkles, Search } from "lucide-react";

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<"ALL" | ProjectType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Default ordering: PRJ-003, PRJ-001, PRJ-002, PRJ-004
  const defaultOrder = ["prj-003", "prj-001", "prj-002", "prj-004"];
  const sortedProjects = [...projectsData].sort((a, b) => {
    return defaultOrder.indexOf(a.id) - defaultOrder.indexOf(b.id);
  });

  const filteredProjects = sortedProjects.filter((project) => {
    const matchesFilter = activeFilter === "ALL" || project.type === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.oneLiner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.stack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.highlights?.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="projects" className="pt-20 border-t border-border">
      {/* Section Header */}
      <div className="mb-10 space-y-4">
        <div>
          <div className="section-label mb-2">02 | PROJECTS</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-text tracking-tight whitespace-nowrap">
            RESEARCH &amp; BUILDS <span className="text-accent">| TEARSHEETS</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
          <p className="text-sm font-mono text-text-muted max-w-2xl leading-relaxed">
            Vectorized Monte Carlo kernels, high-frequency limit order book dynamics, and streaming ML risk engines. Evaluated with strict out-of-sample discipline.
          </p>

          {/* Filter Controls & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-mono text-xs w-full lg:w-auto shrink-0">
            {/* Tag search input */}
            <div className="relative w-full sm:w-64 md:w-72">
              <Search className="w-3.5 h-3.5 text-text-faint absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stack, tags, or code..."
                className="pl-9 pr-3 h-10 bg-bg-elevated border border-border text-text placeholder:text-text-faint focus:border-accent focus:outline-none rounded w-full text-xs font-mono transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="grid grid-cols-4 items-center bg-bg-elevated border border-border p-1 rounded w-full sm:w-64 md:w-72 h-10">
              {(["ALL", "Quant", "ML", "Full-Stack"] as const).map((tab) => {
                const isActive = activeFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`h-full flex items-center justify-center font-semibold uppercase text-[10.5px] sm:text-[11px] whitespace-nowrap transition-all rounded-sm px-1 ${
                      isActive
                        ? "bg-accent text-bg shadow-sm"
                        : "text-text-muted hover:text-text hover:bg-bg-inset"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Projects 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.article
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              key={project.id}
              className="terminal-panel flex flex-col justify-between p-6 bg-bg-elevated border border-border hover:border-accent transition-all duration-200 group relative hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-center justify-between font-mono text-xs border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-accent">{project.code}</span>
                    <span className="text-text-faint">&middot;</span>
                    <span className="px-1.5 py-0.5 bg-bg-inset border border-border text-[10px] text-text-muted">
                      {project.type}
                    </span>
                    {project.featured && (
                      <span className="px-1.5 py-0.5 bg-accent/15 border border-accent/40 text-[9px] text-accent font-semibold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>QUANT FLAGSHIP</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-text-faint">
                    <span>{project.dateRange}</span>
                    <span className="text-text-faint hidden sm:inline">&middot;</span>
                    <span className="text-up hidden sm:inline text-[10px] font-semibold">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Title & One-Liner */}
                <div>
                  <h3 className="text-2xl font-bold font-heading text-text group-hover:text-accent transition-colors">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed">
                    {project.oneLiner}
                  </p>
                </div>

                {/* Interactive SVG Visual */}
                <div className="pt-1">
                  <ProjectCardVisual slug={project.slug} />
                </div>

                {/* Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 pb-1 font-mono text-xs tabular-nums">
                  {project.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-bg-inset border border-border rounded flex flex-col justify-between min-w-0 overflow-hidden min-h-[54px]"
                    >
                      <span className="text-[10px] text-text-faint uppercase truncate block">{m.label}</span>
                      <span
                        title={m.value}
                        className={`font-bold mt-0.5 leading-snug break-words ${
                          m.value.length > 15
                            ? "text-[10px] sm:text-[10.5px]"
                            : m.value.length > 10
                            ? "text-[11px] sm:text-xs"
                            : "text-sm"
                        } ${m.highlight ? "text-accent" : "text-text"}`}
                      >
                        {m.value} {m.change && <span className="text-xs">{m.change}</span>}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Honesty Badges */}
                <div className="pt-2">
                  <div className="text-[10px] font-mono text-text-faint uppercase mb-1.5">
                    Model Verification &amp; Honesty Badges
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {project.honestyBadges.map((badge, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 border rounded-sm flex items-center gap-1 ${
                          badge.verified
                            ? "bg-up/10 border-up/30 text-up font-medium"
                            : "bg-down/10 border-down/30 text-down/80"
                        }`}
                      >
                        <span>{badge.label}</span>
                        <span>{badge.verified ? "✓" : "✗"}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-bg-inset border border-border text-[11px] font-mono text-text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-6 mt-6 border-t border-border flex items-center justify-between font-mono text-xs">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-accent font-bold hover:brightness-125 transition-all"
                >
                  <span>TEARSHEET &rarr;</span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-muted hover:text-text flex items-center gap-1 transition-colors px-1"
                    >
                      <span>CODE</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {project.clientRepoPrivate && (
                    <span className="text-text-faint text-[10px] px-2 py-0.5 bg-bg-inset border border-border">
                      CODE: PRIVATE
                    </span>
                  )}

                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-up/10 border border-up/30 text-up hover:bg-up/20 rounded-sm flex items-center gap-1.5 transition-colors font-semibold"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse" />
                      <span>{project.id === "prj-004" ? "LIVE SITE" : "CLIENT REPO"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
