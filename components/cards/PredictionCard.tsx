import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Prediction } from "@/lib/types";
import { Flag } from "@/components/ui/Flag";
import { PredictionBar } from "./PredictionBar";

export function PredictionCard({ prediction }: { prediction: Prediction }) {
  return (
    <Link
      href={`/predictions/${prediction.slug}`}
      className="card group flex flex-col gap-5 p-5 transition-transform hover:-translate-y-1"
    >
      <header className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <Flag team={prediction.home} size="sm" className="ring-2 ring-surface" />
          <Flag team={prediction.away} size="sm" className="ring-2 ring-surface" />
        </div>
        <div>
          <h3 className="text-sm font-bold transition-colors group-hover:text-pitch">
            {prediction.title}
          </h3>
          <p className="text-[11px] text-muted">{prediction.meta}</p>
        </div>
        <ArrowRight
          className="ml-auto h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-pitch"
          aria-hidden
        />
      </header>
      <PredictionBar outcomes={prediction.outcomes} />
    </Link>
  );
}
