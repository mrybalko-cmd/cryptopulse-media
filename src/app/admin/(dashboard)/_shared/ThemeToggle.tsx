'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

// Mirrors src/components/layout/ThemeToggle.tsx's mechanism (same `.light`
// class toggle) but persisted under its own `admin-theme` localStorage key,
// deliberately separate from the public site's `theme` key — multiple staff
// members share this admin panel and each picks their own theme here
// without it leaking to (or from) the public site on the same origin.
export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('admin-theme');
    } catch {}
    const shouldBeLight = stored === 'light';
    document.documentElement.classList.toggle('light', shouldBeLight);
    setIsLight(shouldBeLight);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle('light', next);
    try {
      localStorage.setItem('admin-theme', next ? 'light' : 'dark');
    } catch {}
  }

  if (!mounted) return <div className="w-full h-8" />;

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-semibold text-[var(--admin-text-muted)] hover:bg-[var(--admin-input)] hover:text-[var(--admin-text)] transition-colors w-full"
    >
      {isLight ? <Moon size={14} /> : <Sun size={14} />}
      {isLight ? 'Тёмная тема' : 'Светлая тема'}
    </button>
  );
}
