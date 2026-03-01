import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Dimension, StyleRecord } from "@/lib/types";

const DIMENSIONS: Dimension[] = ["melody", "harmony", "rhythm", "timbre"];
const DIMENSION_THEMES = {
  melody: {
    eyebrow: "Contour and singable motion",
    heroGlow: "from-[#fff0d8] via-[#fff9ef] to-[#fff7f0]",
    accentBar: "from-[#d97706] via-[#f59e0b] to-[#fbbf24]",
    accentSolid: "bg-[#e88d37]",
    accentSoft: "bg-[#fff1dd]",
    accentBorder: "border-[#f1c48d]",
    accentText: "text-[#9a5b18]"
  },
  harmony: {
    eyebrow: "Cadence and progression logic",
    heroGlow: "from-[#ddfaf5] via-[#f0fffc] to-[#eefcfb]",
    accentBar: "from-[#0f766e] via-[#14b8a6] to-[#5eead4]",
    accentSolid: "bg-[#129c91]",
    accentSoft: "bg-[#ddfaf5]",
    accentBorder: "border-[#90ddd4]",
    accentText: "text-[#0f766e]"
  },
  rhythm: {
    eyebrow: "Pulse, swing, and meter",
    heroGlow: "from-[#ffe0de] via-[#fff7f6] to-[#fff0ee]",
    accentBar: "from-[#b91c1c] via-[#ef4444] to-[#fca5a5]",
    accentSolid: "bg-[#df4d42]",
    accentSoft: "bg-[#ffe7e4]",
    accentBorder: "border-[#f0aaa3]",
    accentText: "text-[#a33025]"
  },
  timbre: {
    eyebrow: "Texture, energy, and production feel",
    heroGlow: "from-[#dfeeff] via-[#f4f9ff] to-[#edf5ff]",
    accentBar: "from-[#1d4ed8] via-[#3b82f6] to-[#93c5fd]",
    accentSolid: "bg-[#3778e5]",
    accentSoft: "bg-[#e8f1ff]",
    accentBorder: "border-[#adc8fb]",
    accentText: "text-[#2456b9]"
  }
} as const;

export function getDimensions(): Dimension[] {
  return DIMENSIONS;
}

export function formatDimensionLabel(dimension: Dimension): string {
  return dimension.charAt(0).toUpperCase() + dimension.slice(1);
}

export function getDimensionTheme(dimension: Dimension) {
  return DIMENSION_THEMES[dimension];
}

export async function getStylesForDimension(dimension: Dimension): Promise<StyleRecord[]> {
  const filePath = path.join(process.cwd(), "data", `styles_${dimension}.json`);

  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as StyleRecord[];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error while loading style data.";
    throw new Error(
      `Missing generated data for ${dimension}. Run "npm run build:styles" first. ${message}`
    );
  }
}
