import {useTheme} from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setThemeManually } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setThemeManually(isDark ? "light" : "dark")}
      className={`w-8 h-5 sm:w-12 sm:h-5 flex items-center justify-between px-1 rounded-full transition-colors
        ${isDark ? "bg-gray-800" : "bg-yellow-300"}`}
    >
      <Sun
        className={`h-6 w-6 transition-opacity duration-300
          ${isDark ? "opacity-0" : "opacity-100 text-yellow-600"}`}
      />
      <Moon
        className={`h-6 w-6 transition-opacity duration-300
          ${isDark ? "opacity-100 text-gray-200" : "opacity-0"}`}
      />
    </button>
  );
}
