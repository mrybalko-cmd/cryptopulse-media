'use client';

import { useState } from 'react';

// Collapsed accordion on mobile, plain always-open column on desktop.
// Deliberately NOT a native <details> element — closed-details content is
// only reliably display:none in some browsers; others (notably Safari)
// render it via an internal UA slot that ignores CSS overrides entirely,
// so a closed-by-default <details> forced open at lg: via !important can
// silently stay empty there. This uses the same hidden/lg:block pattern
// already proven elsewhere on the site (ShareButtons, PopularSidebar aside)
// instead. Content is always in the SSR HTML either way — only its
// display is toggled, so links stay crawlable regardless of state.
export default function FooterNavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-border pt-4 lg:border-0 lg:pt-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full lg:pointer-events-none flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-widest text-muted mb-0 lg:mb-4"
      >
        {title}
        <span
          className={`text-muted lg:hidden transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      <ul className={`list-none p-0 m-0 mt-3 lg:mt-0 space-y-2 lg:block ${open ? 'block' : 'hidden'}`}>
        {children}
      </ul>
    </div>
  );
}
