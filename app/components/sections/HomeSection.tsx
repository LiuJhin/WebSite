"use client";

import { useRef } from "react";
import Hero from "./Hero";
import { useTheme } from "../ThemeProvider";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stories = [
  {
    category: "Philosophy",
    title: "The Art of Scalability",
    desc: "Architecture is more than just connecting servers. It's about designing systems that breathe and adapt to the unpredictable flow of global traffic.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200", // 科技感抽象图
  },
  {
    category: "Methodology",
    title: "Atomic Engineering",
    desc: "By breaking down complex interfaces into immutable components, we ensure that performance remains consistent while the scale grows infinitely.",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200", // 结构化几何图
  },
];

export function HomeSection() {
  const { themeConfig } = useTheme();
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".parallax-img").forEach((img) => {
        gsap.to(img, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            scrub: true,
          },
        });
      });

      gsap.from(".reveal-up", {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".reveal-up",
          start: "top 85%",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative space-y-48 pb-40 px-4 md:px-12"
    >
      <Hero />

      {stories.map((story, i) => (
        <div
          key={i}
          className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-20 items-center`}
        >
          <div className="flex-1 space-y-8 reveal-up">
            <div className="text-[10px] uppercase tracking-[0.6em] opacity-30 italic">
              {story.category}
            </div>
            <h2
              className="text-5xl md:text-7xl font-light tracking-tighter leading-none"
              style={{ color: themeConfig.text }}
            >
              {story.title.split(" ").map((word, idx) => (
                <span
                  key={idx}
                  className={idx === 2 ? "italic font-serif opacity-40" : ""}
                >
                  {word}{" "}
                </span>
              ))}
            </h2>
            <p className="text-lg opacity-40 font-light leading-relaxed max-w-md">
              {story.desc}
            </p>
            <div className="pt-4">
              <button className="text-[10px] uppercase tracking-[0.4em] border-b border-white/20 pb-2 hover:border-white transition-all">
                Read Manifesto
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-[4/5] overflow-hidden rounded-sm reveal-up">
            <img
              src={story.image}
              alt={story.title}
              className="parallax-img absolute inset-0 w-full h-[120%] object-cover grayscale brightness-50 contrast-125 hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
          </div>
        </div>
      ))}

      <div className="space-y-24">
        <div className="flex items-center justify-between reveal-up">
          <h3 className="text-[10px] uppercase tracking-[0.8em] opacity-30">
            Featured Archives
          </h3>
          <span className="h-px w-24 bg-white/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group relative aspect-video overflow-hidden reveal-up">
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200"
              alt="Cloud Governance"
              className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000"
            />
            <div className="absolute bottom-10 left-10 space-y-2">
              <div className="text-2xl font-light tracking-tight text-white">
                Cloud Governance
              </div>
              <div className="text-[9px] uppercase tracking-[0.4em] text-white/40">
                2025 // Infrastructure
              </div>
            </div>
          </div>

          <div className="group relative aspect-video overflow-hidden reveal-up md:mt-24">
            <img
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1200"
              alt="Global Neural Hub"
              className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000"
            />
            <div className="absolute bottom-10 left-10 space-y-2">
              <div className="text-2xl font-light tracking-tight text-white">
                Global Neural Hub
              </div>
              <div className="text-[9px] uppercase tracking-[0.4em] text-white/40">
                2026 // AI Engine
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-40 border-y border-white/5 reveal-up">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <p
            className="text-4xl md:text-6xl font-light leading-[1.1] tracking-tighter"
            style={{ color: themeConfig.text }}
          >
            Designing
            <span className="italic font-serif opacity-30">
              resilient systems
            </span>
            that bridge the gap between human intuition and machine precision.
          </p>
          <div className="flex justify-center items-center gap-12">
            <div className="text-[10px] uppercase tracking-[0.4em] opacity-20 whitespace-nowrap">
              Philosophy 2026
            </div>
            <div className="h-px w-12 bg-white/10" />
            <div className="text-[10px] uppercase tracking-[0.4em] opacity-20 whitespace-nowrap">
              Status: Operational
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 bottom-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
