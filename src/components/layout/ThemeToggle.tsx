'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className }: { className?: string }) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Re-apply from localStorage on every mount, not just read the current DOM class.
    // A hydration mismatch elsewhere on the page (e.g. a browser extension that injects
    // attributes before React loads) can make React discard and re-render the whole
    // document, wiping the class our pre-hydration script added. This makes the effect
    // self-healing regardless of what caused that.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('theme');
    } catch {}
    const shouldBeLight = stored === 'light';
    document.documentElement.classList.toggle('light', shouldBeLight);
    setIsLight(shouldBeLight);
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle('light', next);
    try {
      localStorage.setItem('theme', next ? 'light' : 'dark');
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={className ?? 'p-1.5 text-muted hover:text-foreground transition-colors'}
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
