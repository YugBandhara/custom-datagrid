
import { PinSide } from "../../types/grid.types";

export const PIN_OPTIONS: {
  name: string;
  value: PinSide;
  color: "default" | "red";
}[] = [
  { name: "📌 Pin Left", value: "left", color: "default" },
  { name: "📌 Pin Right", value: "right", color: "default" },
  { name: "❌ Unpin", value: null, color: "red" },
];

export const COLUMN_GROUPS = ["General", "Contact", "Employment", "Actions", null] as const;

export const DEFAULT_COLUMN_WIDTH = 150;
export const LEFT_OFFSET_START = 30;
export const MIN_COLUMN_WIDTH = 50;
