import type { CtaConfig } from "@/lib/types";
import { StickyCTA } from "./StickyCTA";
import { ExitIntentPopup } from "./ExitIntentPopup";
import { FloatingCTA } from "./FloatingCTA";

/**
 * Site-wide conversion surfaces. Server component — each child renders only when
 * its placement is enabled in the (Google Sheet) CTA config.
 */
export function ConversionLayer({ config }: { config: CtaConfig }) {
  return (
    <>
      {config.floating && <FloatingCTA cta={config.floating} />}
      {config.sticky && <StickyCTA cta={config.sticky} />}
      {config.exit_intent && <ExitIntentPopup cta={config.exit_intent} />}
    </>
  );
}
