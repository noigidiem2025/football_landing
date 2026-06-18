import { Container } from "@/components/ui/Container";

export default function MatchDetailLoading() {
  return (
    <Container className="py-8 sm:py-12">
      <div className="mb-6 h-5 w-36 animate-pulse rounded bg-white/5" />
      <div className="card overflow-hidden">
        <div className="border-b border-line p-5 sm:p-6">
          <div className="h-4 w-40 animate-pulse rounded bg-white/5" />
          <div className="mt-4 h-10 w-full max-w-xl animate-pulse rounded bg-white/5" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="h-4 animate-pulse rounded bg-white/5" />
            <div className="h-4 animate-pulse rounded bg-white/5" />
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 p-5 sm:p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 animate-pulse rounded-full bg-white/5" />
            <div className="h-4 w-28 animate-pulse rounded bg-white/5" />
          </div>
          <div className="h-12 w-24 animate-pulse rounded bg-white/5" />
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 animate-pulse rounded-full bg-white/5" />
            <div className="h-4 w-28 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      </div>
    </Container>
  );
}
