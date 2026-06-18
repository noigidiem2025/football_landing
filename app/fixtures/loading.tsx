import { Container } from "@/components/ui/Container";

/** Loading skeleton for the fixtures route (shown while the API fetch resolves). */
export default function Loading() {
  return (
    <Container className="py-8 sm:py-12" aria-busy="true" aria-label="Loading">
      <div className="mb-8 space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
        <div className="h-9 w-48 animate-pulse rounded bg-white/5" />
      </div>
      <div className="h-12 w-full animate-pulse rounded-full bg-white/5" />
      <div className="mt-4 flex gap-3">
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-white/5" />
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-white/5" />
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-40 animate-pulse" />
        ))}
      </div>
    </Container>
  );
}
