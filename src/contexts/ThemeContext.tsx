
"use client";
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from "react";
  
  const themes = [
    "light",
    "dark",
    "blue",
    "dim",
    "rose",
    "emerald",
    "amber",
    "slate",
  ];
  
  type ThemeContextType = {
    theme: string;
    setThemeManually: (theme: string) => void;
    toggleTheme: () => void;
  };
  
  const ThemeContext = createContext<ThemeContextType | null>(null);
  
  export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState("light");
  
    useEffect(() => {
      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const defaultTheme = storedTheme || (prefersDark ? "dark" : "light");
  
      setTheme(defaultTheme);
      applyTheme(defaultTheme);
    }, []);
  
    const applyTheme = (newTheme: string) => {
      document.documentElement.classList.remove(...themes);
      document.documentElement.classList.add(newTheme);
      localStorage.setItem("theme", newTheme);
    };
  
    const setThemeManually = (newTheme: string) => {
      setTheme(newTheme);
      applyTheme(newTheme);
    };
  
    const toggleTheme = () => {
      const index = themes.indexOf(theme);
      const next = themes[(index + 1) % themes.length];
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
  