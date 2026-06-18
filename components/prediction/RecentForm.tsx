import type { FormResult, PredictionArticle, Team } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Flag } from "@/components/ui/Flag";
import { cn } from "@/lib/utils";

const formStyle: Record<FormResult, string> = {
  W: "bg-pitch-soft text-pitch",
  D: "bg-white/10 text-muted",
  L: "bg-live/15 text-live",
};

function FormColumn({ team, form }: { team: Team; form: FormResult[] }) {
  const wins = form.filter((f) => f === "W").length;
  return (
    <div className="card flex flex-col gap-4 p-5">
      <div className="flex items-center gap-2.5">
        <Flag team={team} size="sm" />
        <span className="font-semibold">{team.name}</span>
        <span className="ml-auto text-[11px] font-semibold uppercase tracking-wider text-muted">
          {wins}W / {form.length}
        </span>
      </div>
      <div className="flex gap-2">
        {form.map((result, i) => (
          <span
            key={i}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
              formStyle[result],
            )}
            aria-label={
              result === "W" ? "Win" : result === "D" ? "Draw" : "Loss"
            }
          >
            {result}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RecentForm({ article }: { article: PredictionArticle }) {
  if (article.homeForm.length === 0 && article.awayForm.length === 0) return null;

  return (
    <section id="form" aria-labelledby="form-heading" className="scroll-mt-24">
      <SectionHeading id="form-heading" eyebrow="Last 5 matches" title="Recent Form" />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormColumn team={article.home} form={article.homeForm} />
        <FormColumn team={article.away} form={article.awayForm} />
      </div>
    </section>
  );
}
