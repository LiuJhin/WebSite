"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Theme =
  | "midnight"
  | "sand"
  | "titanium"
  | "moss"
  | "black"
  | "white";

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
  midnight: {
    name: "Midnight",
    bg: "#080c0c",
    text: "#d1d5d5",
    accent: "#2af598",
    border: "#1a2222",
    borderStrong: "#2d3a3a",
    shadow: "rgba(0,0,0,0.8)",
    backgroundGradient:
      "radial-gradient(1200px 600px at 80% 20%, rgba(42, 245, 152, 0.05), transparent 70%), linear-gradient(180deg, #080c0c 0%, #0d1414 100%)",
    textMuted: "#d1d5d566",
    textSecondary: "#d1d5d5aa",
    bgSecondary: "#ffffff05",
  },
  sand: {
    name: "Sand",
    bg: "#e5e0d8",
    text: "#24211e",
    accent: "#8c7851",
    border: "#d1c9bc",
    borderStrong: "#b5a894",
    shadow: "rgba(0,0,0,0.05)",
    backgroundGradient:
      "radial-gradient(1000px 600px at 10% 10%, rgba(255,255,255,0.5), transparent 50%), linear-gradient(120deg, #e5e0d8 0%, #dfd8cd 100%)",
    textMuted: "#24211e80",
    textSecondary: "#24211e99",
    bgSecondary: "#00000005",
  },
  titanium: {
    name: "Titanium",
    bg: "#161618",
    text: "#ececed",
    accent: "#ff3e00",
    border: "#28282a",
    borderStrong: "#3f3f42",
    shadow: "rgba(0,0,0,0.5)",
    backgroundGradient:
      "radial-gradient(800px 500px at 50% 0%, rgba(255,255,255,0.03), transparent 70%), linear-gradient(145deg, #161618 0%, #1c1c1f 100%)",
    textMuted: "#ececed66",
    textSecondary: "#ececedaa",
    bgSecondary: "#ffffff08",
  },
  moss: {
    name: "Moss",
    bg: "#0a0f0d",
    text: "#c4c8ad",
    accent: "#8e916d",
    border: "#1d231f",
    borderStrong: "#2a332d",
    shadow: "rgba(0,0,0,0.6)",
    backgroundGradient:
      "radial-gradient(1200px 700px at 0% 0%, rgba(142, 145, 109, 0.08), transparent 50%), linear-gradient(180deg, #0a0f0d 0%, #121a16 100%)",
    textMuted: "#c4c8ad66",
    textSecondary: "#c4c8adaa",
    bgSecondary: "#ffffff03",
  },
  black: {
    name: "Black",
    bg: "#000000",
    text: "#ffffff",
    accent: "#ffffff",
    border: "#222222",
    borderStrong: "#444444",
    shadow: "rgba(0,0,0,1)",
    backgroundGradient: "none",
    textMuted: "#ffffff66",
    textSecondary: "#ffffff99",
    bgSecondary: "#ffffff05",
  },
  white: {
    name: "White",
    bg: "#ffffff",
    text: "#121212",
    accent: "#121212",
    border: "#eeeeee",
    borderStrong: "#dddddd",
    shadow: "rgba(0,0,0,0.05)",
    backgroundGradient: "none",
    textMuted: "#12121266",
    textSecondary: "#12121299",
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
  const [theme, setThemeState] = useState<Theme>("midnight");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && themeConfigs[savedTheme]) {
      setThemeState(savedTheme);
    }
  }, []);

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
        className="min-h-screen transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: themeConfigs[theme].bg,
          color: themeConfigs[theme].text,
          backgroundImage: themeConfigs[theme].backgroundGradient,
        }}
      >
        <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
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
