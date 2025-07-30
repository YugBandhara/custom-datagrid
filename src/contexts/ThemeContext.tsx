"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { THEMES_KEY, ThemeType } from "../constants/Theme.constants";
import { ThemeContextType } from "@/types/theme.types";


const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as ThemeType | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const defaultTheme = storedTheme || (prefersDark ? "dark" : "light");

    setTheme(defaultTheme);
    applyTheme(defaultTheme);
  }, []);

  const applyTheme = (newTheme: ThemeType) => {
    document.documentElement.classList.remove(...THEMES_KEY);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setThemeManually = (newTheme: ThemeType) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const index = THEMES_KEY.indexOf(theme);
    const next = THEMES_KEY[(index + 1) % THEMES_KEY.length];
    setThemeManually(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeManually, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};
