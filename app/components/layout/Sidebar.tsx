"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "../ThemeProvider";
import { navItems } from "../../data/navigation";

type SidebarProps = {
  items?: string[];
  active?: string;
  onSelect?: (item: string) => void;
};

const SocialIcons = {
  Twitter: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Github: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
};

export default function Sidebar({
  items = navItems,
  active,
  onSelect,
}: SidebarProps) {
  const { themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  const navRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!navRef.current) return;

    if (isOpen) {
      gsap.to(navRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.6,
        ease: "expo.out",
      });
      gsap.fromTo(
        itemsRef.current,
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: "power2.out" },
      );
    } else {
      gsap.to(navRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    <aside
      className="sticky top-12 left-0 h-fit w-64 flex flex-col gap-10 p-6 transition-all duration-500"
      style={{ color: themeConfig.accent }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 active:scale-95 overflow-hidden"
        style={{
          color: themeConfig.text,
          backgroundColor: themeConfig.bgSecondary,
          boxShadow: `inset 0 0 0 1px ${themeConfig.borderStrong}, 0 10px 30px -10px rgba(0,0,0,0.2)`,
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative w-5 h-4 flex flex-col justify-between items-center">
          <span
            className={`h-[1.5px] bg-current transition-all duration-500 ease-in-out ${isOpen ? "w-5 rotate-45 translate-y-[7.5px]" : "w-4"}`}
          />
          <span
            className={`h-[1.5px] bg-current transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : "w-5"}`}
          />
          <span
            className={`h-[1.5px] bg-current transition-all duration-500 ease-in-out ${isOpen ? "w-5 -rotate-45 -translate-y-[7.5px]" : "w-3"}`}
          />
        </div>
      </button>

      <nav
        ref={navRef}
        className="flex flex-col items-start gap-4 overflow-hidden"
      >
        {items.map((item: string, index: number) => (
          <button
            key={item}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            onClick={() => onSelect?.(item)}
            className="group relative flex items-center py-1 text-[11px] font-bold uppercase tracking-[0.3em] transition-none"
            style={{
              color:
                active === item ? themeConfig.text : themeConfig.textSecondary,
            }}
          >
            <span
              className={`mr-4 h-px bg-current transition-all duration-500 ease-expo ${active === item ? "w-10" : "w-0 group-hover:w-4"}`}
              style={{
                backgroundColor:
                  active === item ? themeConfig.accent : "currentColor",
              }}
            />
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              {item}
            </span>
          </button>
        ))}
      </nav>

      <div
        className="mt-4 flex flex-col gap-6"
        style={{ color: themeConfig.textSecondary }}
      >
        <div className="h-px w-8 bg-current opacity-20" />

        <div className="flex gap-4">
          <a
            href="#"
            className="p-2 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-300"
          >
            <SocialIcons.Twitter />
          </a>
          <a
            href="#"
            className="p-2 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-300"
          >
            <SocialIcons.Github />
          </a>
        </div>

        <div className="space-y-1 opacity-40">
          <p className="text-[10px] font-bold tracking-widest uppercase">
            Transmat ©
          </p>
          <p className="text-[9px] italic font-serif">Merry year the same</p>
        </div>
      </div>
    </aside>
  );
}
