import { Density } from "@/types/grid.types";

export const DENSITY_OPTIONS = ["compact", "standard", "comfortable"] as const;

export const DENSITY_LABELS: Record<Density, string> = {
  compact: "Compact",
  standard: "Standard",
  comfortable: "Comfortable",
};


