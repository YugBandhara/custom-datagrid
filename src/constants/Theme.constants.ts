export const THEMES = [
  { label: "Blue", value: "blue", color: "bg-blue-500" },
  { label: "Dim", value: "dim", color: "bg-zinc-700" },
  { label: "Rose", value: "rose", color: "bg-rose-500" },
  { label: "Emerald", value: "emerald", color: "bg-emerald-500" },
  { label: "Slate", value: "slate", color: "bg-slate-500" },
  { label: "Amber", value: "amber", color: "bg-amber-400" },
] as const;

export const THEMES_KEY = [
  "light",
  "dark",
  "blue",
  "dim",
  "rose",
  "emerald",
  "amber",
  "slate",
] as const;

export type ThemeType = (typeof THEMES_KEY)[number];

