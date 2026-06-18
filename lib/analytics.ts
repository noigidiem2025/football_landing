/**
 * Lightweight, provider-agnostic analytics. Events are pushed to
 * `window.dataLayer` (GTM) and forwarded to `gtag` when present. No-ops on the
 * server and when no provider is configured, so it is always safe to call.
 */
export type AnalyticsEvent =
  | "page_view"
  | "cta_click"
  | "outbound_click"
  | "scroll_depth"
  | "search";

interface GtagWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

export function track(
  event: AnalyticsEvent,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  try {
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event, ...params });
    if (typeof w.gtag === "function") {
      w.gtag("event", event, params);
    }
  } catch {
    /* analytics is best-effort */
  }
}
