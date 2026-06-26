'use client';

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

interface TranslationContextValue {
  translationHref: string | null;
  setTranslationHref: (href: string | null) => void;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationLinkProvider({ children }: { children: ReactNode }) {
  const [translationHref, setTranslationHref] = useState<string | null>(null);
  const value = useMemo(() => ({ translationHref, setTranslationHref }), [translationHref]);
  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslationLink() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslationLink must be used within TranslationLinkProvider');
  return ctx;
}
