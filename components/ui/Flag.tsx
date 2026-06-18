import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Team } from "@/lib/types";

interface FlagProps {
  team: Team;
  /** Rendered pixel size (height auto-derives a 4:3 width). */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const dims: Record<NonNullable<FlagProps["size"]>, { w: number; h: number }> = {
  sm: { w: 28, h: 20 },
  md: { w: 40, h: 28 },
  lg: { w: 60, h: 42 },
};

/**
 * Country flag via flagcdn optimized static images. Fixed width/height to
 * prevent layout shift; lazy by default so it never blocks LCP.
 */
export function Flag({ team, size = "md", className }: FlagProps) {
  const { w, h } = dims[size];
  return (
    <Image
      src={`https://flagcdn.com/h60/${team.flag}.png`}
      alt={`${team.name} flag`}
      width={w}
      height={h}
      className={cn("rounded object-cover shadow-sm ring-1 ring-white/10", className)}
    />
  );
}
