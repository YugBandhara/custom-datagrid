import { ThemeType } from "@/constants/Theme.constants";

export interface ThemeContextType {
  theme: ThemeType;
  setThemeManually: (theme: ThemeType) => void;
  toggleTheme: () => void;
};