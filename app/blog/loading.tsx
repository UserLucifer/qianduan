import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <main className="shell py-12">
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--surface)]">
              <Skeleton className="aspect-[16/9] rounded-none" />
              <div className="space-y-4 p-5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-52 rounded-xl" />
      </div>
    </main>
  );
}
