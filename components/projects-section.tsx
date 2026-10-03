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
      project.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="projects" className="pt-20 border-t border-border">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="section-label mb-2">02 // PROJECTS</div>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-text tracking-tight">
            RESEARCH &amp; BUILDS <span className="text-accent">// TEARSHEETS</span>
          </h2>
          <p className="text-sm font-mono text-text-muted mt-2 max-w-2xl">
            Vectorized Monte Carlo kernels, high-frequency limit order book dynamics, and streaming ML risk engines. Evaluated with strict out-of-sample discipline.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-mono text-xs">
          {/* Tag search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-faint absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack or tags..."
              className="pl-8 pr-3 py-1.5 bg-bg-elevated border border-border text-text placeholder:text-text-faint focus:border-accent focus:outline-none rounded w-full sm:w-48 text-xs"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-bg-elevated border border-border p-0.5 rounded">
            {(["ALL", "Quant", "ML", "Full-Stack"] as const).map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1 font-semibold uppercase text-[11px] transition-all rounded-sm ${
                    isActive
                      ? "bg-accent text-bg"
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
                      className="p-2 bg-bg-inset border border-border rounded flex flex-col justify-between"
                    >
                      <span className="text-[10px] text-text-faint uppercase">{m.label}</span>
                      <span
                        className={`text-sm font-bold mt-0.5 ${
                          m.highlight ? "text-accent" : "text-text"
                        }`}
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
                <div className="flex flex-wrap gap-1.5 pt-1">
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
                  className="inline-flex items-center gap-1.5 text-accent font-bold hover:underline"
                >
                  <span>TEARSHEET &rarr;</span>
                </Link>

                <div className="flex items-center gap-3">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-muted hover:text-text flex items-center gap-1 transition-colors"
                    >
                      <span>CODE</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {project.clientRepoPrivate && (
                    <span className="text-text-faint text-[10px] px-2 py-0.5 bg-bg-inset border border-border">
                      CODE: PRIVATE (client work)
                    </span>
                  )}

                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline flex items-center gap-1 transition-colors"
                    >
                      <span>CLIENT REPO</span>
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
