import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Sparkles,
  Scissors,
  UtensilsCrossed,
  PartyPopper,
  Briefcase,
  Dumbbell,
  Camera,
  Sofa,
  Palette,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  scissors: Scissors,
  utensils: UtensilsCrossed,
  utensils_crossed: UtensilsCrossed,
  party_popper: PartyPopper,
  briefcase: Briefcase,
  dumbbell: Dumbbell,
  camera: Camera,
  sofa: Sofa,
  palette: Palette,
  layout_grid: LayoutGrid,
};

/** Resolve API `iconName` to a Lucide icon; unknown or null → generic grid icon. */
export function getCategoryIconComponent(iconName: string | null | undefined): LucideIcon {
  if (!iconName || typeof iconName !== "string") return LayoutGrid;
  const key = iconName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
  return ICON_MAP[key] ?? LayoutGrid;
}
