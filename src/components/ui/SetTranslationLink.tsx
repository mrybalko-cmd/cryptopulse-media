'use client';

import { useEffect } from 'react';
import { useTranslationLink } from '@/lib/translation-context';

export default function SetTranslationLink({ href }: { href: string | null }) {
  const { setTranslationHref } = useTranslationLink();

  useEffect(() => {
    setTranslationHref(href);
    return () => setTranslationHref(null);
  }, [href, setTranslationHref]);

  return null;
}
