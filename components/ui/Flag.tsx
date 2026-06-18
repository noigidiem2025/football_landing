import { cn } from "@/lib/utils";
import type { Team } from "@/lib/types";

interface FlagProps {
  team: Team;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass: Record<NonNullable<FlagProps["size"]>, string> = {
  sm: "h-5 min-w-7 px-1 text-[10px]",
  md: "h-7 min-w-10 px-1.5 text-xs",
  lg: "h-12 min-w-16 px-2 text-lg",
};

function flagEmoji(code: string): string | null {
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return null;

  return normalized
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

/**
 * Local-only flag fallback. Uses emoji when the team has an ISO alpha-2 code,
 * otherwise falls back to the team's short code. No remote image request.
 */
export function Flag({ team, size = "md", className }: FlagProps) {
  const emoji = flagEmoji(team.flag);
  const label = emoji ?? team.code;

  return (
    <span
      aria-label={`${team.name} flag`}
      role="img"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded bg-white/5 font-bold uppercase shadow-sm ring-1 ring-white/10",
        sizeClass[size],
        className,
      )}
    >
      {label}
    </span>
  );
}
