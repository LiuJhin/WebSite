"use client";

import { themeConfigs, useTheme } from "./ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, setTheme, themes, themeConfig } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: themeConfig.textMuted }}
      >
        Theme
      </span>
      <div className="flex gap-1">
        {themes.map((themeOption) => {
          const config = themeConfigs[themeOption];
          return (
            <button
              key={themeOption}
              className={`h-8 w-8 rounded-full transition-all duration-200 ${
                theme === themeOption ? "scale-110" : "hover:scale-105"
              }`}
              style={{
                backgroundColor: config.bg,
                boxShadow:
                  theme === themeOption
                    ? `0 0 0 2px ${themeConfig.borderStrong}`
                    : `0 0 0 1px ${themeConfig.borderStrong}`,
              }}
              onClick={() => setTheme(themeOption)}
              aria-label={`Switch to ${themeOption} theme`}
              type="button"
            />
          );
        })}
      </div>
    </div>
  );
}
