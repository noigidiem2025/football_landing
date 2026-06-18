import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small uppercase eyebrow above the title. */
  eyebrow?: string;
  title: string;
  /** Optional id so the heading can anchor an aria-labelledby section. */
  id?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  id,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4 sm:mb-8", className)}>
      <div>
        {eyebrow && (
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-pitch">
            {eyebrow}
          </span>
        )}
        <h2
          id={id}
          className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl"
        >
          {title}
        </h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
