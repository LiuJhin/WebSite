"use client";

import { useRef } from "react";
import { useTheme } from "../ThemeProvider";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Cloud Governance Protocol",
    category: "Infrastructure / ToB",
    tech: ["Nuxt3", "AWS Lambda", "Terraform"],
    desc: "A unified cockpit architected for multi-cloud resource orchestration and real-time cost-efficiency analytics.",
    id: "ARCH_01",
    year: "2025",
  },
  {
    title: "Global Messaging Engine",
    category: "Communication / Scalability",
    tech: ["Vue3", "Node.js", "Redis"],
    desc: "High-throughput SMS gateway processing 10M+ daily events with millisecond-latency routing protocols.",
    id: "ARCH_02",
    year: "2024",
  },
  {
    title: "Neural Interaction Hub",
    category: "Interactive / ToC",
    tech: ["React", "WebGL", "Socket.io"],
    desc: "Lightweight engagement platform utilizing real-time data streams and low-latency synchronization.",
    id: "ARCH_03",
    year: "2024",
  },
];

export function ProjectSection() {
  const { themeConfig } = useTheme();
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".project-row", {
        scrollTrigger: {
          trigger: ".project-list",
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "expo.out",
      });

      gsap.from(".header-line", {
        scaleX: 0,
        transformOrigin: "left",
        scrollTrigger: {
          trigger: ".project-header",
          start: "top 90%",
        },
        duration: 2,
        ease: "expo.inOut",
      });
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="relative space-y-32 py-40">
      <div className="project-header space-y-8 px-4">
        <div className="flex items-baseline justify-between">
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.6em] opacity-30 italic">
              Module // Archive
            </div>
            <h2
              className="text-6xl md:text-8xl font-light tracking-tighter italic font-serif"
              style={{ color: themeConfig.text }}
            >
              Selected Cases
            </h2>
          </div>
          <div className="hidden md:block text-right space-y-2 opacity-20 text-[9px] font-mono leading-relaxed uppercase">
            Build: Mar_2026
            <br />
            Protocol: Full_Access
          </div>
        </div>
        <div className="header-line h-px w-full bg-white/10" />
      </div>

      <div className="project-list space-y-px bg-white/5 border-y border-white/5">
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-row group relative grid grid-cols-1 md:grid-cols-12 gap-8 py-20 px-4 md:px-12 bg-black hover:bg-white/2 transition-all duration-700 cursor-pointer overflow-hidden"
          >
            <div className="absolute right-[5%] top-1/2 -translate-y-1/2 text-[15vw] font-serif italic opacity-0 group-hover:opacity-[0.03] translate-x-10 group-hover:translate-x-0 transition-all duration-1000 select-none">
              {project.id.split("_")[1]}
            </div>

            <div className="md:col-span-2 space-y-2">
              <div className="text-[9px] font-mono opacity-20">
                / {project.id}
              </div>
              <div className="text-xs opacity-40 italic font-serif">
                {project.year}
              </div>
            </div>

            <div className="md:col-span-6 space-y-6">
              <div className="space-y-2">
                <div
                  className="text-[9px] uppercase tracking-[0.4em] opacity-30 font-bold"
                  style={{ color: themeConfig.accent }}
                >
                  {project.category}
                </div>
                <h3
                  className="text-4xl md:text-5xl font-light tracking-tighter group-hover:pl-4 transition-all duration-500"
                  style={{ color: themeConfig.text }}
                >
                  {project.title}
                </h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed opacity-40 font-light group-hover:opacity-80 transition-opacity">
                {project.desc}
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col justify-between items-end text-right">
              <div className="flex flex-wrap justify-end gap-x-4 gap-y-2 max-w-[200px]">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity font-mono"
                  >
                    [{t}]
                  </span>
                ))}
              </div>

              <div className="mt-8 md:mt-0 flex items-center gap-4 group/btn">
                <span className="text-[9px] uppercase tracking-[0.5em] opacity-0 group-hover:opacity-40 transition-opacity">
                  Case Details
                </span>
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 group-hover/btn:border-white transition-colors duration-500">
                  <svg
                    className="w-4 h-4 opacity-40 group-hover/btn:opacity-100 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-current transition-all duration-700 group-hover:w-full opacity-10" />
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-20">
        <button className="group relative flex items-center gap-12 py-8 px-16 border border-white/5 rounded-full hover:border-white/20 transition-all duration-700">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] uppercase tracking-[0.5em] opacity-40">
              Access Full Registry
            </span>
            <span className="text-[8px] font-mono opacity-20">
              TOTAL_PROJECTS: 24
            </span>
          </div>
          <div className="text-4xl font-light italic font-serif group-hover:translate-x-4 transition-transform duration-700">
            More →
          </div>
          <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500/40" />
        </button>
      </div>
    </section>
  );
}
