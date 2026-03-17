"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Theme = "default" | "light" | "warm" | "cool" | "black" | "white";

interface ThemeConfig {
  name: string;
  bg: string;
  text: string;
  accent: string;
  border: string;
  borderStrong: string;
  shadow: string;
  backgroundGradient: string;
  textMuted: string;
  textSecondary: string;
  bgSecondary: string;
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
  default: {
    name: "Default",
    bg: "#2d1a12",
    text: "#ffffff",
    accent: "#f1e4d4",
    border: "#ffffff",
    borderStrong: "#ffffffcc",
    shadow: "rgba(30,12,8,0.45)",
    backgroundGradient:
      "radial-gradient(1200px 600px at 80% 20%, rgba(140, 35, 24, 0.75), transparent 60%), radial-gradient(900px 700px at 10% 10%, rgba(255, 220, 170, 0.4), transparent 70%), linear-gradient(120deg, #c09a70 0%, #b07a4f 45%, #6b1b13 100%)",
    textMuted: "#ffffff99",
    textSecondary: "#ffffffcc",
    bgSecondary: "#ffffff0a",
  },
  light: {
    name: "Light",
    bg: "#f8f6f0",
    text: "#2d1a12",
    accent: "#8b7355",
    border: "#2d1a12",
    borderStrong: "#2d1a12cc",
    shadow: "rgba(0,0,0,0.1)",
    backgroundGradient:
      "radial-gradient(1200px 600px at 80% 20%, rgba(139, 115, 85, 0.3), transparent 60%), radial-gradient(900px 700px at 10% 10%, rgba(248, 246, 240, 0.6), transparent 70%), linear-gradient(120deg, #e8e2d4 0%, #d4c4a8 45%, #a89070 100%)",
    textMuted: "#2d1a1266",
    textSecondary: "#2d1a12cc",
    bgSecondary: "#2d1a120a",
  },
  warm: {
    name: "Warm",
    bg: "#3a1f0f",
    text: "#fff8e1",
    accent: "#ffb74d",
    border: "#ffb74d",
    borderStrong: "#ffb74dcc",
    shadow: "rgba(255,183,77,0.2)",
    backgroundGradient:
      "radial-gradient(1200px 600px at 80% 20%, rgba(255, 183, 77, 0.6), transparent 60%), radial-gradient(900px 700px at 10% 10%, rgba(255, 248, 225, 0.5), transparent 70%), linear-gradient(120deg, #ffab40 0%, #ff8a00 45%, #e65100 100%)",
    textMuted: "#fff8e199",
    textSecondary: "#fff8e1cc",
    bgSecondary: "#fff8e10a",
  },
  cool: {
    name: "Cool",
    bg: "#1a1a2e",
    text: "#e6e6fa",
    accent: "#4fc3f7",
    border: "#4fc3f7",
    borderStrong: "#4fc3f7cc",
    shadow: "rgba(79,195,247,0.2)",
    backgroundGradient:
      "radial-gradient(1200px 600px at 80% 20%, rgba(79, 195, 247, 0.5), transparent 60%), radial-gradient(900px 700px at 10% 10%, rgba(230, 230, 250, 0.4), transparent 70%), linear-gradient(120deg, #29b6f6 0%, #0277bd 45%, #01579b 100%)",
    textMuted: "#e6e6fa99",
    textSecondary: "#e6e6facc",
    bgSecondary: "#e6e6fa0a",
  },
  black: {
    name: "Black",
    bg: "#000000",
    text: "#ffffff",
    accent: "#999999",
    border: "#444444",
    borderStrong: "#888888",
    shadow: "rgba(0,0,0,0.7)",
    backgroundGradient:
      "radial-gradient(1200px 600px at 80% 20%, rgba(255, 255, 255, 0.1), transparent 60%), radial-gradient(900px 700px at 10% 10%, rgba(255, 255, 255, 0.05), transparent 70%), linear-gradient(120deg, #000000 0%, #0d0d0d 45%, #1a1a1a 100%)",
    textMuted: "#ffffff99",
    textSecondary: "#ffffffcc",
    bgSecondary: "#ffffff0a",
  },
  white: {
    name: "White",
    bg: "#ffffff",
    text: "#121212",
    accent: "#444444",
    border: "#cccccc",
    borderStrong: "#666666",
    shadow: "rgba(0,0,0,0.08)",
    backgroundGradient:
      "radial-gradient(1200px 600px at 80% 20%, rgba(0, 0, 0, 0.05), transparent 60%), radial-gradient(900px 700px at 10% 10%, rgba(0, 0, 0, 0.03), transparent 70%), linear-gradient(120deg, #ffffff 0%, #f0f0f0 45%, #e0e0e0 100%)",
    textMuted: "#12121280",
    textSecondary: "#121212cc",
    bgSecondary: "#00000005",
  },
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeConfig: ThemeConfig;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      return savedTheme && themeConfigs[savedTheme] ? savedTheme : "default";
    }
    return "default";
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const value = {
    theme,
    setTheme,
    themeConfig: themeConfigs[theme],
    themes: Object.keys(themeConfigs) as Theme[],
  };

  return (
    <ThemeContext.Provider value={value}>
      <div
        className="min-h-screen transition-colors duration-500 ease-out"
        style={{
          backgroundColor: themeConfigs[theme].bg,
          color: themeConfigs[theme].text,
          backgroundImage: themeConfigs[theme].backgroundGradient,
          transition: "background 0.5s ease, color 0.5s ease",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
