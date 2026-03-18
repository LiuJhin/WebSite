"use client";

import Link from "next/link";
import { useRef } from "react";
import { useTheme } from "../ThemeProvider";
import { threeJSProjects } from "../../data/threejs-projects";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function ThreejsLab() {
  const { themeConfig } = useTheme();
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.refresh();

      gsap.from(".lab-title-char", {
        y: 60,
        opacity: 0,
        rotateX: -90,
        stagger: 0.03,
        duration: 1,
        ease: "expo.out",
      });

      const cards = gsap.utils.toArray<HTMLElement>(".lab-card");

      cards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card, // 以每个卡片自己为触发点
            start: "top 90%", // 当卡片顶部进入屏幕 90% 位置时触发
            toggleActions: "play none none reverse",
          },
          y: 40,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "power2.out",
        });
      });
    },
    { scope: containerRef },
  );

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    el: HTMLDivElement,
  ) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;

    gsap.to(el, {
      rotateX: -dy / 20,
      rotateY: dx / 20,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (el: HTMLDivElement) => {
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-4 md:px-12 overflow-hidden"
    >
      {/* Header 部分 */}
      <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-6 opacity-30">
            <span className="h-px w-12 bg-current" />
            <span className="text-[9px] font-mono tracking-[0.4em]">
              SYSTEM_VERSION // 4.0.1
            </span>
          </div>
          <h2 className="text-7xl md:text-9xl font-light tracking-tighter italic font-serif leading-[0.8]">
            {"Three.js".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block lab-title-char origin-bottom"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            <span className="block text-3xl md:text-5xl mt-6 opacity-10 not-italic font-sans font-thin tracking-[0.3em]">
              EXPERIMENTS
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {threeJSProjects.map((project, index) => (
          <Link
            href={`/threejs-lab/${project.slug}`}
            key={project.id}
            className={`lab-card group relative col-span-1 overflow-hidden border transition-colors duration-500`}
            style={{
              gridColumn:
                index % 3 === 0
                  ? "span 12"
                  : index % 3 === 1
                    ? "span 7"
                    : "span 5",
              borderColor: `${themeConfig.text}15`,
              perspective: "1000px",
            }}
          >
            <div
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
              className="relative h-full w-full p-8 md:p-12 min-h-[400px] flex flex-col justify-between"
              style={{ backgroundColor: `${themeConfig.bgSecondary}` }}
            >
              <div className="absolute top-0 right-12 h-full w-px bg-white/5" />

              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono opacity-20">
                  [{project.id}]
                </span>
                <span className="text-[9px] uppercase tracking-widest opacity-40 px-3 py-1 border border-current rounded-full">
                  {project.category}
                </span>
              </div>

              <div className="space-y-6">
                <h3 className="text-4xl md:text-6xl font-light tracking-tighter italic font-serif leading-none">
                  {project.title}
                </h3>
                <p className="max-w-md text-sm font-light opacity-0 group-hover:opacity-40 transition-all duration-700 translate-y-4 group-hover:translate-y-0 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="h-px flex-1 bg-current opacity-10" />
                <div className="text-[10px] uppercase tracking-[0.5em] font-bold group-hover:text-emerald-500 transition-colors">
                  Run_Module →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
