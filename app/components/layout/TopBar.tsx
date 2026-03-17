"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTheme } from "../ThemeProvider";
import ThemeSwitcher from "../ThemeSwitcher";

export default function TopBar() {
  const { themeConfig } = useTheme();
  const [activePanel, setActivePanel] = useState<"search" | "discover" | null>(
    null,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const discoverPanelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(searchPanelRef.current, {
      height: activePanel === "search" ? "auto" : 0,
      opacity: activePanel === "search" ? 1 : 0,
      y: activePanel === "search" ? 0 : -10,
      duration: 0.5,
      ease: "expo.out",
    });

    gsap.to(discoverPanelRef.current, {
      height: activePanel === "discover" ? "auto" : 0,
      opacity: activePanel === "discover" ? 1 : 0,
      y: activePanel === "discover" ? 0 : -10,
      duration: 0.5,
      ease: "expo.out",
    });
  }, [activePanel]);

  const togglePanel = (panel: "search" | "discover") => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div ref={containerRef} className="w-full space-y-6">
      <header className="flex items-center justify-between py-2">
        <div
          className="text-xs font-bold uppercase tracking-[0.6em] opacity-80"
          style={{ color: themeConfig.text }}
        >
          Transmat <span className="font-light opacity-40">/ Archive v1.0</span>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <ThemeSwitcher />

          <div className="h-4 w-px bg-current opacity-10 mx-2" />

          <button
            onClick={() => togglePanel("search")}
            className="group relative flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-500"
            style={{
              backgroundColor:
                activePanel === "search"
                  ? themeConfig.text
                  : themeConfig.bgSecondary,
              color:
                activePanel === "search" ? themeConfig.bg : themeConfig.text,
              boxShadow: `0 0 0 1px ${themeConfig.borderStrong}`,
            }}
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-500 ${activePanel === "search" ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {activePanel === "search" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              )}
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block">
              {activePanel === "search" ? "Close" : "Search"}
            </span>
          </button>

          <button
            onClick={() => togglePanel("discover")}
            className="group flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-500"
            style={{
              backgroundColor:
                activePanel === "discover"
                  ? themeConfig.text
                  : themeConfig.bgSecondary,
              color:
                activePanel === "discover" ? themeConfig.bg : themeConfig.text,
              boxShadow: `0 0 0 1px ${themeConfig.borderStrong}`,
            }}
          >
            <div className="relative w-3.5 h-3.5">
              <span
                className={`absolute inset-0 border-2 border-current rounded-full transition-transform duration-500 ${activePanel === "discover" ? "scale-0" : "scale-100"}`}
              />
              <span
                className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-current rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ${activePanel === "discover" ? "scale-150" : "scale-0"}`}
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block">
              Discover
            </span>
          </button>
        </div>
      </header>

      <div className="grid gap-4">
        <div
          ref={searchPanelRef}
          className="overflow-hidden rounded-2xl border backdrop-blur-xl"
          style={{
            backgroundColor: themeConfig.bgSecondary,
            borderColor: themeConfig.borderStrong,
          }}
        >
          <div className="p-6">
            <div className="relative flex items-center">
              <input
                autoFocus
                className="w-full bg-transparent py-2 pl-2 pr-10 text-lg font-light tracking-tight focus:outline-none"
                placeholder="Search archive..."
                style={{ color: themeConfig.text }}
              />
              <div className="absolute right-2 text-[9px] uppercase tracking-widest opacity-30 italic">
                Enter to search
              </div>
            </div>
            <div className="mt-4 h-px w-full bg-current opacity-5" />
          </div>
        </div>

        <div
          ref={discoverPanelRef}
          className="overflow-hidden rounded-2xl border backdrop-blur-xl"
          style={{
            backgroundColor: themeConfig.bgSecondary,
            borderColor: themeConfig.borderStrong,
          }}
        >
          <div className="p-6 flex flex-wrap gap-4">
            {[
              "Recent Projects",
              "Core Essays",
              "System Notes",
              "Technical Labs",
            ].map((tag) => (
              <button
                key={tag}
                className="px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5 hover:bg-white hover:text-black transition-all duration-300"
                style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
