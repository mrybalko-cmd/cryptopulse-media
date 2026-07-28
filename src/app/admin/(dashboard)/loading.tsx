// Next.js wraps every route under (dashboard) in a Suspense boundary keyed
// to this file — it shows the instant the user clicks a nav link, while the
// target page's own data fetch (auth check + Sanity queries) resolves in
// the background. Without this, App Router keeps the *previous* page frozen
// on screen with zero feedback until the whole next page is ready, which is
// what reads as a "hang" even when the actual fetch is under ~250ms.
export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-40 rounded bg-[var(--admin-input)] mb-6" />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-[var(--admin-panel)] border border-[var(--admin-border)]" />
        ))}
      </div>
    </div>
  );
}
