"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Post } from "../../types/post";
import PostCard from "../cards/PostCard";

gsap.registerPlugin(ScrollTrigger);

type PostGridProps = {
  posts: Post[];
};

export default function PostGrid({ posts }: PostGridProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".post-wrapper");
    if (!cards.length) return;

    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === containerRef.current) st.kill();
    });

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 40,
        rotateX: -15,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.2,
        stagger: {
          amount: 0.8,
          grid: "auto",
          from: "start",
        },
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  }, [posts]);

  return (
    <section
      ref={containerRef}
      className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 perspective-1000"
    >
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="post-wrapper group relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute -left-4 -top-4 text-4xl font-serif italic opacity-[0.03] select-none pointer-events-none group-hover:opacity-10 group-hover:-translate-y-2 transition-all duration-700">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="relative transition-transform duration-500 group-hover:-translate-y-2">
            <PostCard {...post} />
          </div>

          <div className="mt-6 h-px w-full bg-current opacity-5 group-hover:opacity-20 transition-opacity" />
        </div>
      ))}

      {posts.length > 0 && (
        <div className="col-span-full pt-12 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
          <div className="h-px w-24 bg-current" />
          <span className="text-[9px] uppercase tracking-[0.6em]">
            End of Archive
          </span>
        </div>
      )}
    </section>
  );
}
