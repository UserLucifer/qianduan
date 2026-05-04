import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function BlogDetailLoading() {
  return (
    <main className="shell min-h-screen py-16">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
          <ArrowLeft className="h-4 w-4" />
          Back to Insights
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
          <div className="mb-6 flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="mb-4 h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <div className="mt-8 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </header>

        <Skeleton className="mb-16 aspect-[16/9] w-full rounded-3xl" />

        <div className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </main>
  );
}
