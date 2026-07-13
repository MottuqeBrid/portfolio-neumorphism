export function ProjectCardSkeleton() {
  return (
    <div className="nm-protrude flex flex-col overflow-hidden rounded-3xl">
      <div className="nm-dent m-3 aspect-video animate-pulse rounded-2xl bg-slate-300/50" />
      <div className="flex flex-col gap-3 p-5 pt-2">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-300/50" />
        <div className="h-4 w-full animate-pulse rounded-full bg-slate-300/40" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-300/40" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-300/40" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-300/40" />
        </div>
      </div>
    </div>
  );
}
