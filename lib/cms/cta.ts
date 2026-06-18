import { cache } from "react";
import type { Cta, CtaConfig, CtaPlacement, VipTip } from "@/lib/types";
import { fetchSheetRows } from "./client";
import { ctaConfig as fallbackConfig, vipTips as fallbackTips } from "@/mocks/cta";

const CTA_TAB = process.env.SHEET_CTA_TAB ?? "cta";
const VIP_TIPS_TAB = process.env.SHEET_VIP_TIPS_TAB ?? "vip_tips";

type Row = Record<string, string>;

function rowsToObjects(rows: string[][]): Row[] {
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const obj: Row = {};
    headers.forEach((h, i) => {
      obj[h] = (cells[i] ?? "").trim();
    });
    return obj;
  });
}

function asBool(v: string | undefined): boolean {
  const s = (v ?? "").toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

const PLACEMENTS: CtaPlacement[] = [
  "sticky",
  "exit_intent",
  "in_article",
  "floating",
  "sidebar",
];

/**
 * CTA config keyed by placement. Live Google Sheet `cta` rows when configured,
 * else local fixtures. Only enabled rows with a destination are returned.
 */
export const getCtaConfig = cache(async (): Promise<CtaConfig> => {
  const rows = await fetchSheetRows(CTA_TAB);
  if (!rows) return fallbackConfig;

  const config: CtaConfig = {};
  for (const r of rowsToObjects(rows)) {
    const placement = r.placement as CtaPlacement;
    if (!PLACEMENTS.includes(placement)) continue;
    if (!asBool(r.enabled) || !r.href) continue;
    const cta: Cta = {
      placement,
      enabled: true,
      title: r.title || "",
      subtitle: r.subtitle || undefined,
      ctaLabel: r.cta_label || "Learn more",
      href: r.href,
      badge: r.badge || undefined,
    };
    config[placement] = cta;
  }

  // If the sheet had no usable rows, fall back so the UI is never blank.
  return Object.keys(config).length > 0 ? config : fallbackConfig;
});

/** Resolve a single placement (enabled only). */
export async function getCta(placement: CtaPlacement): Promise<Cta | null> {
  const config = await getCtaConfig();
  return config[placement] ?? null;
}

export const getVipTips = cache(async (): Promise<VipTip[]> => {
  const rows = await fetchSheetRows(VIP_TIPS_TAB);
  if (!rows) return fallbackTips;

  const tips = rowsToObjects(rows)
    .filter((r) => r.match && r.market)
    .map<VipTip>((r) => ({
      match: r.match,
      market: r.market,
      odds: r.odds || "—",
      locked: asBool(r.locked),
    }));

  return tips.length > 0 ? tips : fallbackTips;
});
