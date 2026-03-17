"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  useTheme,
  PostGrid,
  Sidebar,
  TopBar,
  HomeSection,
  AboutSection,
  ProjectSection,
  ContactSection,
} from "./components";
import { navItems } from "./data/navigation";
import { posts } from "./data/posts";

export default function Home() {
  const { themeConfig } = useTheme();
  const [activeSection, setActiveSection] = useState(navItems[0] ?? "Home");
  const [activeFilter, setActiveFilter] = useState("All");
  const containerRef = useRef<HTMLDivElement>(null);

  const filters = ["All", "Feature", "Essay", "Review", "Note"];
  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") return posts;
    return posts.filter((post) => post.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.fromTo(
      container,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    );
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 editorial-noise" />
        <div
          ref={containerRef}
          className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-8"
        >
          <TopBar />
          <div className="grid flex-1 gap-10 md:grid-cols-[200px_1fr]">
            <Sidebar
              items={navItems}
              active={activeSection}
              onSelect={setActiveSection}
            />
            <main
              className="space-y-8 rounded-2xl p-6 backdrop-blur-xl shadow-lg"
              style={{
                backgroundColor: `${themeConfig.bg}05`,
                boxShadow: `0_20px_60px_${themeConfig.shadow}`,
              }}
            >
              {activeSection === "Home" ? <HomeSection /> : null}
              {activeSection === "Archive" ? (
                <section className="space-y-6 animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div
                      className="text-xs uppercase tracking-[0.3em]"
                      style={{ color: themeConfig.textMuted }}
                    >
                      Archive Filters
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.map((filter) => (
                        <button
                          key={filter}
                          className="rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.3em] transition"
                          style={{
                            boxShadow: `0 0 0 1px ${themeConfig.borderStrong}`,
                            color:
                              activeFilter === filter
                                ? themeConfig.text
                                : themeConfig.textSecondary,
                          }}
                          type="button"
                          onClick={() => setActiveFilter(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                  <PostGrid posts={filteredPosts} />
                  <div
                    className="rounded-xl px-4 py-3 text-xs uppercase tracking-[0.3em] backdrop-blur-lg shadow-sm"
                    style={{
                      backgroundColor: themeConfig.bgSecondary,
                      color: themeConfig.textMuted,
                    }}
                  >
                    Showing {filteredPosts.length} entries
                  </div>
                </section>
              ) : null}
              {activeSection === "About" ? <AboutSection /> : null}
              {activeSection === "Projects" ? <ProjectSection /> : null}
              {activeSection === "Contact" ? <ContactSection /> : null}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
