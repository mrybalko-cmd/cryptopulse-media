'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light' | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as 'dark' | 'light') || 'dark');
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.cookie = `admin_theme=${next}; path=/admin; max-age=31536000`;
  }

  if (!theme) return <div className="w-full h-8" />;

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-semibold text-[var(--admin-text-muted)] hover:bg-[var(--admin-input)] hover:text-[var(--admin-text)] transition-colors w-full"
    >
      {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
    </button>
  );
}
