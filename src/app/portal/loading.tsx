/**
 * `/portal` is force-dynamic and does three sequential round trips before it
 * can render anything. Without a loading state the browser sat on a blank
 * response for all of them; this streams the chrome immediately instead.
 */
export default function PortalLoading() {
  return (
    <main id="main" className="px-7 py-14">
      <div className="mx-auto max-w-[1180px]">
        <div className="h-4 w-40 animate-pulse rounded-pill bg-paper-dim" />
        <div className="mt-4 h-9 w-72 animate-pulse rounded-lg bg-paper-dim" />

        <div className="mt-10 space-y-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-line bg-white p-6 shadow-card"
            >
              <div className="h-4 w-1/3 animate-pulse rounded-pill bg-paper-dim" />
              <div className="mt-3 h-3 w-1/2 animate-pulse rounded-pill bg-paper-dim" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
