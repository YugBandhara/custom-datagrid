
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/DropDownMenu";
import { BsPalette } from "react-icons/bs";
import useTheme from "@/hooks/useTheme";

const themes = [
  { label: "Light", value: "light", color: "bg-white border" },
  { label: "Dark", value: "dark", color: "bg-neutral-800" },
  { label: "Blue", value: "blue", color: "bg-blue-500" },
  { label: "Dim", value: "dim", color: "bg-zinc-700" },
  { label: "Rose", value: "rose", color: "bg-rose-500" },
  { label: "Emerald", value: "emerald", color: "bg-emerald-500" },
  { label: "Slate", value: "slate", color: "bg-slate-500" },
  { label: "Amber", value: "amber", color: "bg-amber-400" },
];

export default function ThemeSelector() {
  const { theme, setThemeManually } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="px-2 py-1 border rounded-md flex items-center gap-2 text-sm">
          <BsPalette /> Theme
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto p-2 z-[999]">
        <div className="flex flex-wrap gap-3">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setThemeManually(t.value)}
              title={t.label}
              className={`w-6 h-6 rounded-full ${t.color} border-2 border-white ring-2 ${
                theme === t.value
                  ? "ring-black dark:ring-white"
                  : "ring-transparent"
              }`}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
