"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropDownMenu";
import { BsPalette } from "react-icons/bs";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/constants/Theme.constants";



const  ThemeSelector = () => {
  const { theme, setThemeManually } = useTheme();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1330px)");
  const isResponsive = isMobile || isTablet;
  const [open, setOpen] = useState(false);

  const handleDropDown = () => {
    setOpen(false)
  };

  const ThemeOptions = (
    <div className="flex flex-wrap gap-2 sm:gap-3 max-w-[240px] px-1 py-1">
      {THEMES.map((t) => (
        <button
          key={t.value}
          onClick={() => {
            setThemeManually(t.value);
            if (!isResponsive) {
              handleDropDown();
            }
          }}

          title={t.label}
          className={`w-4 h-4 rounded-full ${t.color} border-2 border-white ring-2 ${theme === t.value
              ? "ring-black dark:ring-white"
              : "ring-transparent"
            }`}
        />
      ))}
    </div>
  );

  return isResponsive ? (

    <div className="flex flex-col items-start gap-2 mt-2">

      {ThemeOptions}
    </div>
  ) : (

    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="px-3 py-1 w-full sm:w-auto border rounded-md flex items-center gap-2 text-sm">
          <BsPalette className="h-4 w-4" />
          Theme
        </Button >
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto p-2 z-[999]">
        <div className="px-2 py-1 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground">
            Theme Options
          </span>
        </div>
        {ThemeOptions}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSelector
