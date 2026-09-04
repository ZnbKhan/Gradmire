/**
 * Every /admin route is force-dynamic and runs a staff check before its own
 * queries, so there is always a wait. Stream a skeleton rather than nothing.
 */
export default function AdminLoading() {
  return (
    <div>
      <div className="h-8 w-56 animate-pulse rounded-lg bg-line/50" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-line bg-white"
          />
        ))}
      </div>
      <div className="mt-8 h-64 animate-pulse rounded-2xl border border-line bg-white" />
    </div>
  );
}
