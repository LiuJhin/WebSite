"use client";

import { useRef } from "react";
import { useTheme } from "../ThemeProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const { themeConfig } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // 1. 标题字符位移
      gsap.from(".reveal-text", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".reveal-text",
          start: "top 90%",
        },
      });

      // 2. 垂直装饰线生长
      gsap.from(".vertical-divider", {
        scaleY: 0,
        duration: 1.5,
        ease: "power4.inOut",
        transformOrigin: "top",
        scrollTrigger: {
          trigger: ".vertical-divider",
          start: "top 80%",
        },
      });

      // 3. 经历项交错滑动
      gsap.from(".exp-item", {
        x: -30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".exp-container",
          start: "top 70%",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative space-y-40 pb-40 px-6 md:px-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-20">
        <div className="md:col-span-4 space-y-6">
          <div className="text-[10px] uppercase tracking-[0.6em] opacity-30 italic">
            Module // Identity
          </div>
          <h2
            className="text-6xl md:text-8xl font-light tracking-tighter italic font-serif leading-none"
            style={{ color: themeConfig.text }}
          >
            About
          </h2>
        </div>
        <div className="md:col-span-8">
          <p
            className="reveal-text text-3xl md:text-5xl font-light tracking-tight leading-[1.1]"
            style={{ color: themeConfig.text }}
          >
            A <span className="opacity-30">Full-Stack Architect</span> bridging
            the void between{" "}
            <span className="italic font-serif">aesthetic precision</span> and{" "}
            <span style={{ color: themeConfig.accent }}>
              computational logic
            </span>
            .
          </p>
          <div className="mt-12 max-w-xl text-sm opacity-40 leading-relaxed font-light">
            Based in the digital ether, I specialize in crafting
            high-concurrency systems that don&apos;t just function—they
            resonate. My methodology centers on the &quot;Atomic
            Performance&quot; principle: every pixel and every line of code must
            serve a measurable purpose.
          </div>
        </div>
      </div>

      <div className="exp-container grid grid-cols-1 md:grid-cols-12 gap-12 relative">
        <div className="vertical-divider absolute left-0 md:left-[25%] top-0 w-px h-full bg-white/10 hidden md:block" />

        <div className="md:col-span-3">
          <div className="sticky top-40 space-y-4">
            <div className="text-[10px] uppercase tracking-[0.6em] opacity-30 italic">
              Section // Chronicle
            </div>
            <p className="text-[11px] opacity-40 leading-relaxed uppercase tracking-widest">
              A timeline of technical evolution and architectural contributions.
            </p>
          </div>
        </div>

        <div className="md:col-span-9 space-y-24 pl-0 md:pl-20">
          {[
            {
              role: "Senior Frontend Engineer",
              co: "ByteDance",
              period: "2022 — PRESENT",
              desc: "Engineered core UI systems for global scalability. Reduced bundle size by 40% through custom tree-shaking protocols.",
              tech: ["Next.js", "Rust", "WebAssembly"],
            },
            {
              role: "Full-Stack Developer",
              co: "Tencent",
              period: "2021 — 2022",
              desc: "Developed high-concurrency real-time communication modules. Optimized WebSocket stability for 10M+ peak users.",
              tech: ["Node.js", "Redis", "Socket.io"],
            },
            {
              role: "Computer Science Degree",
              co: "Peking University",
              period: "2018 — 2022",
              desc: "Focused on Software Engineering and Digital Art. Recipient of Excellence in Technical Design Award.",
              tech: ["C++", "OpenGL", "Algorithms"],
            },
          ].map((item, i) => (
            <div key={i} className="exp-item group relative space-y-6">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <h3
                  className="text-3xl font-light tracking-tight"
                  style={{ color: themeConfig.text }}
                >
                  {item.role}
                </h3>
                <span className="text-[10px] font-mono opacity-20 tracking-widest">
                  {item.period}
                </span>
              </div>
              <div
                className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold"
                style={{ color: themeConfig.accent }}
              >
                {item.co}
              </div>
              <p className="text-sm opacity-40 font-light max-w-2xl leading-relaxed group-hover:opacity-80 transition-opacity">
                {item.desc}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {item.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-mono opacity-20 border-b border-white/5 pb-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 order-2 md:order-1">
          <div className="relative aspect-video overflow-hidden rounded-sm group">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
              className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
              alt="Technical Aesthetic"
            />
            <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          </div>
        </div>
        <div className="md:col-span-5 order-1 md:order-2 space-y-12">
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.6em] opacity-30 italic">
              Module // Stack
            </div>
            <h3 className="text-4xl font-light tracking-tight">The Toolkit</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            {[
              { category: "Frontend", tools: "Next.js / GSAP / TS" },
              { category: "Backend", tools: "Node / Postgres / Go" },
              { category: "DevOps", tools: "AWS / Docker / K8s" },
              { category: "Design", tools: "Figma / Spline / 3D" },
            ].map((s) => (
              <div key={s.category} className="space-y-2">
                <div className="text-[9px] uppercase tracking-[0.4em] opacity-20 font-bold">
                  {s.category}
                </div>
                <div className="text-xs font-light opacity-60 tracking-wide">
                  {s.tools}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-32 border-t border-white/5 flex flex-col items-center text-center space-y-12">
        <div className="text-[10px] uppercase tracking-[0.8em] opacity-20 animate-pulse">
          Available for Collaboration
        </div>
        <h3 className="text-5xl md:text-7xl font-light tracking-tighter italic font-serif">
          Let&apos;s build the <span className="opacity-20">next</span> archive.
        </h3>
        <button className="group relative px-12 py-5 overflow-hidden border border-white/10 rounded-full transition-all hover:border-white">
          <span className="relative z-10 text-[10px] uppercase tracking-[0.5em]">
            Initiate Contact
          </span>
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <span className="absolute inset-0 flex items-center justify-center text-black text-[10px] uppercase tracking-[0.5em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            hello@transmat.io
          </span>
        </button>
      </div>
    </section>
  );
}
