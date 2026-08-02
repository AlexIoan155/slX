import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function AssessmentSkeleton() {
  return (
    <div>
      <Container className="flex gap-12 py-10">
        <div className="hidden w-64 shrink-0 space-y-2 lg:block">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-xl" />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <Skeleton className="h-11 w-full max-w-sm" />
          <div className="mt-8 space-y-7 rounded-2xl border border-surface-border bg-surface px-6 py-7 sm:px-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-3/4" />
                <div className="mt-4 flex gap-2.5">
                  <Skeleton className="h-10 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
