"use client";

import { useState, useRef } from "react";
import { useTheme } from "../ThemeProvider";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function ContactSection() {
  const { themeConfig } = useTheme();
  const [status, setStatus] = useState("IDLE"); // IDLE, ENCRYPTING, TRANSMITTING, SUCCESS
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(
    () => {
      // 1. 背景网格与线条生长
      gsap.from(".contact-grid-line", {
        scaleX: 0,
        stagger: 0.1,
        duration: 1.5,
        ease: "expo.inOut",
      });

      // 2. 标题与侧边栏交错揭幕
      gsap.from(".reveal-contact", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
      });
    },
    { scope: sectionRef },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("ENCRYPTING");

    const tl = gsap.timeline();
    // 模拟加密与传输的视觉反馈
    tl.to(".submit-progress", { width: "100%", duration: 2, ease: "none" })
      .add(() => setStatus("SUCCESS"))
      .to(".success-overlay", { opacity: 1, y: 0, duration: 0.5 });

    setTimeout(() => {
      setStatus("IDLE");
      tl.set(".submit-progress", { width: 0 });
      formRef.current?.reset();
    }, 4000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-40 flex flex-col justify-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="contact-grid-line absolute top-1/4 left-0 w-full h-px bg-current" />
        <div className="contact-grid-line absolute top-3/4 left-0 w-full h-px bg-current" />
        <div className="absolute left-1/3 top-0 h-full w-px bg-current opacity-50 border-dashed border-l" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-20 relative z-10">
        <div className="md:col-span-4 space-y-16 reveal-contact">
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.6em] opacity-30 italic font-medium">
              Module // Uplink
            </div>
            <h2
              className="text-6xl md:text-8xl font-light tracking-tighter italic font-serif leading-none"
              style={{ color: themeConfig.text }}
            >
              Contact
            </h2>
          </div>

          <div className="space-y-8 border-l border-white/10 pl-8">
            <div className="space-y-2">
              <div className="text-[9px] uppercase tracking-[0.4em] opacity-20 font-bold">
                Terminal Status
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${status === "SUCCESS" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-current animate-pulse"}`}
                />
                <span className="opacity-60">
                  {status === "IDLE"
                    ? "READY_TO_CONNECT"
                    : `PROTOCOL_${status}`}
                </span>
              </div>
            </div>

            <div className="space-y-4 opacity-30 text-[9px] leading-relaxed uppercase tracking-widest font-light">
              <p>Location: 35.6895° N, 139.6917° E</p>
              <p>Encryption: AES-256-GCM</p>
              <p>Response_ETA: &lt; 24 Hours</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 reveal-contact">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {[
                {
                  id: "01",
                  label: "Subject_Identity",
                  placeholder: "Your name or entity",
                  type: "text",
                },
                {
                  id: "02",
                  label: "Signal_Frequency",
                  placeholder: "Email address",
                  type: "email",
                },
              ].map((field) => (
                <div key={field.id} className="group relative space-y-4">
                  <div className="flex justify-between items-center text-[9px] font-mono opacity-20 group-focus-within:opacity-100 transition-opacity">
                    <span>REQ_{field.id}</span>
                    <span className="italic font-serif">/{field.label}</span>
                  </div>
                  <input
                    required
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full bg-transparent border-b border-white/10 py-4 text-lg font-light focus:outline-none focus:border-white transition-colors placeholder:opacity-10"
                    style={{ color: themeConfig.text }}
                  />
                </div>
              ))}

              <div className="md:col-span-2 group relative space-y-4">
                <div className="flex justify-between items-center text-[9px] font-mono opacity-20 group-focus-within:opacity-100 transition-opacity">
                  <span>REQ_03</span>
                  <span className="italic font-serif">/Data_Payload</span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me about your architectural needs..."
                  className="w-full bg-transparent border-b border-white/10 py-4 text-lg font-light focus:outline-none focus:border-white transition-colors resize-none placeholder:opacity-10"
                  style={{ color: themeConfig.text }}
                />
              </div>
            </div>

            <div className="relative pt-12">
              <button
                type="submit"
                disabled={status !== "IDLE"}
                className="group w-full md:w-auto px-20 py-6 border border-white/10 overflow-hidden relative transition-all hover:border-white/40 disabled:opacity-50"
              >
                <div
                  className="submit-progress absolute bottom-0 left-0 h-0.5 w-0 bg-current transition-all"
                  style={{ color: themeConfig.accent }}
                />

                <span className="relative z-10 text-[10px] uppercase tracking-[0.8em] font-bold">
                  {status === "IDLE" ? "Initialize Uplink" : status}
                </span>

                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-white/3 transition-transform duration-500" />
              </button>

              <div
                className={`success-overlay absolute top-full left-0 mt-6 flex items-center gap-4 transition-all duration-700 ${status === "SUCCESS" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest">
                  Packet received. Handshake verified. Standby for response.
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute -bottom-10 left-0 w-full overflow-hidden opacity-[0.02] pointer-events-none select-none">
        <div className="whitespace-nowrap text-[15vh] font-serif italic tracking-tighter animate-marquee">
          ESTABLISH_CONNECTION — SYNC_ARCHIVE — TRANSMIT_LOGIC —
          ESTABLISH_CONNECTION —
        </div>
      </div>
    </section>
  );
}
