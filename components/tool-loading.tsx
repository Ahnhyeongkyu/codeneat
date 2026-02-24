export function ToolLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="mb-8 space-y-2">
        <div className="h-8 w-80 animate-pulse rounded bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-[400px] animate-pulse rounded-lg border bg-muted" />
        <div className="h-[400px] animate-pulse rounded-lg border bg-muted" />
      </div>
    </div>
  );
}
