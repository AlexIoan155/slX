import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export function DashboardSkeleton() {
  return (
    <div className="pb-24 pt-8">
      <Container>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-3 h-4 w-48" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="flex items-center justify-center p-10">
            <Skeleton className="h-[220px] w-[220px] rounded-full" />
          </Card>
          <Card className="p-8">
            <Skeleton className="h-5 w-40" />
            <div className="mt-6 flex justify-around gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[84px] w-[84px] rounded-full" />
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-8">
          <Skeleton className="h-5 w-56" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      </Container>
    </div>
  );
}
