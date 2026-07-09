import Link from 'next/link';
import './globals.css';

// Catches URLs that don't match any route segment at all (e.g. typos, dead
// links from before a redesign) — these never reach `[locale]/not-found.tsx`
// since the `[locale]` param itself never resolves. The root layout is a
// pass-through (no <html>/<body>), so this needs its own full shell or the
// page renders unstyled, without our CSS at all.
export default function NotFound() {
  return (
    <html lang="en">
      <body className="overflow-x-clip">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">Page not found</h1>
          <p className="text-muted mb-8">
            This page doesn&apos;t seem to exist — it may have been removed, or the address might be incorrect.
          </p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
            ← Back to homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
