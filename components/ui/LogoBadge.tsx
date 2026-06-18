"use client";

import Image from "next/image";
import { useState } from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoBadgeProps {
  label: string;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  icon?: boolean;
}

const sizeClass: Record<NonNullable<LogoBadgeProps["size"]>, string> = {
  xs: "h-4 w-4 text-[8px]",
  sm: "h-6 w-6 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-16 w-16 text-base",
};

const pixelSize: Record<NonNullable<LogoBadgeProps["size"]>, number> = {
  xs: 16,
  sm: 24,
  md: 40,
  lg: 64,
};

function initials(label: string): string {
  const words = label
    .replace(/[^A-Za-z0-9À-ỹ ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "FC";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function LogoBadge({
  label,
  src,
  size = "sm",
  className,
  icon = false,
}: LogoBadgeProps) {
  const [failed, setFailed] = useState(false);
  const shouldShowImage = Boolean(src) && !failed;

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-pitch-soft font-bold uppercase text-pitch ring-1 ring-pitch/20",
        sizeClass[size],
        className,
      )}
    >
      {shouldShowImage ? (
        <Image
          src={src ?? ""}
          alt=""
          width={pixelSize[size]}
          height={pixelSize[size]}
          className="h-full w-full object-contain p-[2px]"
          unoptimized
          onError={() => setFailed(true)}
        />
      ) : icon ? (
        <Trophy className="h-1/2 w-1/2" aria-hidden />
      ) : (
        initials(label)
      )}
    </span>
  );
}
