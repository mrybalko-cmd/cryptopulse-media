'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

// Mirrors src/components/layout/ThemeToggle.tsx exactly: same `.light`
// class toggle, same `theme` localStorage key, so the preference is shared
// between the public site and /admin (one origin, one localStorage).
export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('theme');
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
      localStorage.setItem('theme', next ? 'light' : 'dark');
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
