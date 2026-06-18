"use client";

import Link from "next/link";
import type { CtaPlacement } from "@/lib/types";
import { track } from "@/lib/analytics";

interface CtaLinkProps {
  href: string;
  placement: CtaPlacement;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * Single place that resolves a CTA destination. External (http) links open in a
 * new tab with `rel="sponsored nofollow noopener"` (these are affiliate/partner
 * destinations); internal links use next/link. Fires an optional dataLayer event.
 */
export function CtaLink({
  href,
  placement,
  className,
  children,
  onClick,
}: CtaLinkProps) {
  const external = /^https?:\/\//i.test(href);

  const handleClick = () => {
    track("cta_click", { placement, href });
    if (external) track("outbound_click", { placement, href });
    onClick?.();
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="sponsored nofollow noopener"
        data-cta={placement}
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} data-cta={placement} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
