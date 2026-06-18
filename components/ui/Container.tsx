import { cn } from "@/lib/utils";

/** Centered, max-width page gutter. Mobile-first horizontal padding. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-container px-4 sm:px-6 lg:px-10", className)}>
      {children}
    </div>
  );
}
