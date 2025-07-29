import { useEffect, useState } from 'react';

const themes = ['light', 'dark', 'blue', 'dim','rose', 'emerald', 'amber',  'slate'];

export default function useTheme() {
  const [theme, setTheme] = useState<string>('');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    setTheme(defaultTheme);
    applyTheme(defaultTheme);
  }, []);

  const applyTheme = (newTheme: string) => {
    document.documentElement.classList.remove(...themes);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setThemeManually = (newTheme: string) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return { theme, toggleTheme: () => setThemeManually(nextTheme(theme)), setThemeManually };
}

function nextTheme(current: string) {
  const index = themes.indexOf(current);
  return themes[(index + 1) % themes.length];
}
