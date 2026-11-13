export default function WorkspaceLoading() {
  return (
    <div aria-busy="true" aria-label="Loading page" className="space-y-6 p-4 md:p-6">
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-accent-background motion-reduce:animate-none" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-accent-background motion-reduce:animate-none" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-2xl border border-border bg-card motion-reduce:animate-none" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl border border-border bg-card motion-reduce:animate-none" />
    </div>
  );
}
