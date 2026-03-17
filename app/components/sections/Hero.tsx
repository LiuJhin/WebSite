"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTheme } from "../ThemeProvider";

type HeroProps = {
  month?: string;
  title?: string;
  subtitle?: string;
};

export default function Hero({
  month = "MARCH // 2026",
  title = "Scalable Digital Systems & Architecture.",
  subtitle = "High-performance infrastructure design for the next generation of global platforms.",
}: HeroProps) {
  const { themeConfig } = useTheme();
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".hero-title", {
        y: 100,
        opacity: 0,
        rotateX: -20,
        duration: 1.5,
        ease: "expo.out",
      })

        .from(
          ".hero-meta",
          {
            x: -20,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out",
          },
          "-=1",
        )

        .from(
          ".hero-line",
          {
            scaleX: 0,
            duration: 1.8,
            ease: "expo.inOut",
            transformOrigin: "left",
          },
          "-=1.5",
        );
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="relative pt-20 pb-12">
      <div
        className="hero-line absolute top-0 left-0 w-full h-px opacity-10"
        style={{ backgroundColor: themeConfig.text }}
      />
      <div
        className="hero-line absolute top-0 left-1/4 h-full w-[px] opacity-[0.03] border-l border-dashed"
        style={{ borderColor: themeConfig.text }}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-3 space-y-12">
          <div className="hero-meta space-y-2">
            <div className="text-[10px] uppercase tracking-[0.5em] opacity-30 italic font-medium">
              Timeline
            </div>
            <div
              className="text-xs font-mono opacity-60"
              style={{ color: themeConfig.text }}
            >
              {month}
            </div>
          </div>

          <div className="hero-meta space-y-2">
            <div className="text-[10px] uppercase tracking-[0.5em] opacity-30 italic font-medium">
              Status
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="opacity-60">ACTIVE_PROTOCOL</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-9 space-y-10">
          <h1
            className="hero-title text-5xl md:text-8xl font-light tracking-tighter leading-[0.9] overflow-hidden"
            style={{ color: themeConfig.text }}
          >
            {title}
          </h1>

          <div className="hero-meta max-w-2xl space-y-8">
            <p
              className="text-lg md:text-xl font-light opacity-50 leading-relaxed tracking-tight"
              style={{ color: themeConfig.textSecondary }}
            >
              {subtitle}
            </p>

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="h-px w-12 bg-current opacity-20 group-hover:w-20 group-hover:opacity-100 transition-all duration-700" />
              <span className="text-[9px] uppercase tracking-[0.6em] opacity-30 group-hover:opacity-100 transition-opacity">
                Explore Archive
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-12 right-0 pointer-events-none select-none opacity-[0.02] text-[12vw] font-serif italic whitespace-nowrap">
        Engineering Excellence — Engineering Excellence
      </div>
    </section>
  );
}
