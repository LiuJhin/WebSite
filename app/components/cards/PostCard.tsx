"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Post, Tone } from "../../types/post";

const toneStyles: Record<Tone, string> = {
  sand: "from-[#c39b73] to-[#8d6239]",
  mist: "from-[#d6bda0] to-[#5b6a66]",
  ember: "from-[#9a2c28] to-[#2b0d0a]",
  crimson: "from-[#7b1b16] to-[#3a0a09]",
  fog: "from-[#b3a896] to-[#4b5a56]",
  charcoal: "from-[#3b2b24] to-[#0f0d0c]",
  umber: "from-[#5a3a2a] to-[#1a1310]",
  wine: "from-[#7a1f1a] to-[#1f0e0a]",
  stone: "from-[#8c7f70] to-[#3f3b35]",
};

export default function PostCard({
  badge,
  title,
  meta,
  cta,
  author,
  tone,
  category,
  excerpt,
}: Post) {
  const cardRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const card = cardRef.current;
      const glow = glowRef.current;
      if (!card || !glow) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(glow, { x, y, duration: 0.6, ease: "power2.out" });
    };
    cardRef.current?.addEventListener("mousemove", handleMouseMove);
    return () =>
      cardRef.current?.removeEventListener("mousemove", handleMouseMove);
  });

  return (
    <article
      ref={cardRef}
      className={`group relative flex h-full min-h-105 flex-col overflow-hidden rounded-2xl p-8 transition-all duration-500 bg-linear-to-br ${toneStyles[tone]}`}
      style={{ boxShadow: `0 20px 40px -15px rgba(0,0,0,0.4)` }}
    >
      <div
        ref={glowRef}
        className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 flex flex-1 flex-col">
        <header className="mb-4 flex h-4 items-center justify-between text-[9px] font-bold uppercase tracking-[0.4em] opacity-60 text-white">
          <span className="flex items-center gap-2">
            <span className="h-px w-3 bg-white" />
            {badge}
          </span>
          <span>{category}</span>
        </header>

        <h3 className="mb-4 font-[var(--font-display)] text-2xl leading-[1.2] tracking-tight text-white line-clamp-2">
          {title}
        </h3>

        {excerpt && (
          <p className="text-xs leading-relaxed text-white/60 font-light line-clamp-3">
            {excerpt}
          </p>
        )}

        <div className="flex-1" />

        {meta && (
          <div className="mt-6 flex items-center gap-3 text-[10px] text-white/40 italic font-serif">
            <span className="h-px w-6 bg-white/20" />
            <span className="line-clamp-1">{meta}</span>
          </div>
        )}
      </div>

      <footer className="relative z-10 mt-8 flex items-center justify-between border-t border-white/10 pt-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[8px] text-white/50">
            {author?.[0] ?? "A"}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
            {author}
          </span>
        </div>

        {cta && (
          <button className="group/btn relative overflow-hidden rounded-full bg-white/10 px-5 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black">
            <span className="relative z-10">{cta}</span>
            <div className="absolute inset-0 -translate-y-full bg-white transition-transform duration-300 group-hover/btn:translate-y-0" />
          </button>
        )}
      </footer>

      <div className="absolute left-0 top-1/4 h-1/2 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
    </article>
  );
}
