'use client';

import { useEffect, useRef, useState } from 'react';

// Reads live values straight off the surrounding <form>'s named fields
// (title/slug/seoMetaTitle/seoMetaDescription/excerpt) instead of lifting
// them into controlled state — those inputs already live scattered across
// the rest of NewsForm/ArticleForm as plain uncontrolled fields, and this
// avoids having to rewire all of them just for a preview.
export default function SerpPreview({
  section,
  titleFieldName = 'title',
  slugFieldName = 'slug',
  metaTitleFieldName = 'seoMetaTitle',
  metaDescFieldName = 'seoMetaDescription',
  excerptFieldName = 'excerpt',
}: {
  /** URL path segment right after the locale, e.g. "news" or "articles". */
  section: string;
  titleFieldName?: string;
  slugFieldName?: string;
  metaTitleFieldName?: string;
  metaDescFieldName?: string;
  excerptFieldName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [slug, setSlug] = useState('');
  const [locale, setLocale] = useState('ru');

  useEffect(() => {
    const form = ref.current?.closest('form');
    if (!form) return;
    const get = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
    function read() {
      const titleEl = get(titleFieldName);
      const slugEl = get(slugFieldName);
      const metaTitleEl = get(metaTitleFieldName);
      const metaDescEl = get(metaDescFieldName);
      const excerptEl = get(excerptFieldName);
      const langEl = get('language');
      setTitle((metaTitleEl?.value || titleEl?.value || '').trim());
      setDesc((metaDescEl?.value || excerptEl?.value || '').trim());
      setSlug((slugEl?.value || '').trim());
      if (langEl?.value) setLocale(langEl.value);
    }
    read();
    form.addEventListener('input', read);
    form.addEventListener('change', read);
    // LanguageTabs is a client component that flips a hidden input's `value`
    // via a React property assignment on click — that's neither a native
    // input/change event nor an attribute mutation, so nothing above ever
    // observes it. A light poll is the simplest reliable way to pick it up
    // without having to change LanguageTabs itself.
    const poll = setInterval(read, 600);
    return () => {
      form.removeEventListener('input', read);
      form.removeEventListener('change', read);
      clearInterval(poll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayTitle = title || 'Заголовок появится здесь';
  const displayDesc = desc || 'Описание появится здесь';
  const titleLen = title.length;
  const descLen = desc.length;

  return (
    <div ref={ref} className="mt-2">
      <div className="bg-white rounded-lg p-4" style={{ fontFamily: 'arial,sans-serif' }}>
        <div style={{ fontSize: 12, color: '#202124' }}>
          cryptopulse.media <span style={{ color: '#5f6368' }}>›</span> {locale} <span style={{ color: '#5f6368' }}>›</span> {section}
          {slug && <> <span style={{ color: '#5f6368' }}>›</span> {slug}</>}
        </div>
        <div style={{ fontSize: 18, color: '#1a0dab', lineHeight: 1.3, margin: '2px 0 4px' }}>{displayTitle}</div>
        <div style={{ fontSize: 13, color: '#4d5156', lineHeight: 1.5 }}>{displayDesc}</div>
      </div>
      <div className="text-[10.5px] text-[var(--admin-text-muted)] mt-1.5">
        Title: <span className={titleLen > 60 ? 'text-amber-400 font-bold' : ''}>{titleLen}/60</span>
        {' · '}
        Description: <span className={descLen > 155 ? 'text-amber-400 font-bold' : ''}>{descLen}/155</span>
      </div>
    </div>
  );
}
