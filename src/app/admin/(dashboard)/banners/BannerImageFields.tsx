'use client';

import { useState, type ChangeEvent } from 'react';
import type { AdminBannerDoc, BannerContentTypes, BannerPlacement } from '@/lib/admin/data';

const SPECS = {
  sidebar: { label: 'Квадрат 1:1, от 600×600 px', ratio: 1, w: 600, h: 600 },
  inline: { label: '970×200, загружать 1940×400', ratio: 970 / 200, w: 1940, h: 400 },
  mobile: { label: '320×80, загружать 640×160', ratio: 4, w: 640, h: 160 },
} as const;

type Spec = (typeof SPECS)[keyof typeof SPECS];

/** Предупреждение, если пропорция не та: картинку обрежет object-cover. */
function useRatioCheck(spec: Spec) {
  const [msg, setMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setMsg(null);
    if (preview) URL.revokeObjectURL(preview);
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      const r = img.naturalWidth / img.naturalHeight;
      const off = Math.abs(r - spec.ratio) / spec.ratio;
      const parts: string[] = [];
      if (off > 0.03) parts.push(`пропорция ${img.naturalWidth}×${img.naturalHeight} не совпадает с нужной, края обрежутся`);
      if (img.naturalWidth < spec.w * 0.75) parts.push(`картинка мельче рекомендуемых ${spec.w}×${spec.h}, может быть нерезкой`);
      setMsg(parts.length ? `Внимание: ${parts.join('; ')}.` : null);
    };
    img.src = url;
  };
  return { msg, preview, onChange };
}

function ImageInput({
  name, title, spec, current, previewClass, required,
}: {
  name: string; title: string; spec: Spec; current: string | null; previewClass: string; required: boolean;
}) {
  const { msg, preview, onChange } = useRatioCheck(spec);
  const src = preview ?? current;
  return (
    <div className="mb-4">
      <div className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1">{title}</div>
      <p className="text-[11px] text-[var(--admin-text-dim)] mb-2">{spec.label}, JPG или PNG.</p>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className={`${previewClass} object-cover rounded-lg mb-2 border border-[var(--admin-border)] bg-[var(--admin-input)]`} />
      )}
      <input name={name} type="file" accept="image/*" required={required} onChange={onChange} className="w-full text-[12.5px] text-[var(--admin-text-muted)]" />
      {current && !preview && <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">Оставьте пустым, чтобы не менять текущую картинку.</p>}
      {msg && <p role="alert" className="text-[11.5px] text-amber-500 mt-1">{msg}</p>}
    </div>
  );
}

export default function BannerImageFields({ banner }: { banner?: AdminBannerDoc }) {
  const [placement, setPlacement] = useState<BannerPlacement>(banner?.placement ?? 'sidebar');
  const contentTypes: BannerContentTypes = banner?.contentTypes ?? 'all';
  const inline = placement === 'inline';

  return (
    <>
      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Место показа</div>
        <div className="flex flex-col gap-1.5">
          {([
            ['sidebar', 'Под блоком «Популярное»', 'квадрат 1:1'],
            ['inline', 'В тексте новостей и статей', 'после первого абзаца, 970×200 и 320×80'],
          ] as const).map(([v, label, hint]) => (
            <label key={v} className="flex items-center gap-2 text-[12.5px]">
              <input type="radio" name="placement" value={v} checked={placement === v} onChange={() => setPlacement(v)} />
              {label} <span className="text-[11px] text-[var(--admin-text-dim)]">· {hint}</span>
            </label>
          ))}
        </div>
      </div>

      {inline && (
        <div className="mb-5">
          <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Где показывать</div>
          <div className="flex flex-wrap gap-4">
            {([['all', 'Новости, статьи и рейтинг бирж'], ['news', 'Только новости'], ['article', 'Только статьи']] as const).map(([v, label]) => (
              <label key={v} className="flex items-center gap-1.5 text-[12.5px]">
                <input type="radio" name="contentTypes" value={v} defaultChecked={contentTypes === v} />
                {label}
              </label>
            ))}
          </div>
          <p className="text-[11px] text-[var(--admin-text-dim)] mt-1.5">
            В материалах с плашкой «Промо» или «Новости компании», у партнёрских авторов и с галочкой «Без баннера в тексте» баннер не ставится.
          </p>
        </div>
      )}

      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">
          {inline ? 'Картинки баннера' : 'Картинка баннера'}
        </div>
        {/* key: при смене места превью и проверка пропорции начинаются заново. */}
        <ImageInput
          key={`img-${placement}`}
          name="image"
          title={inline ? 'Десктоп' : 'Картинка'}
          spec={inline ? SPECS.inline : SPECS.sidebar}
          current={banner?.image ?? null}
          previewClass={inline ? 'w-full max-w-[696px] aspect-[970/200]' : 'w-40 h-40'}
          required={!banner?.image}
        />
        {inline && (
          <ImageInput
            name="mobileImage"
            title="Телефон"
            spec={SPECS.mobile}
            current={banner?.mobileImage ?? null}
            previewClass="w-[320px] max-w-full aspect-[4/1]"
            required={!banner?.mobileImage}
          />
        )}
        {inline && (
          <p className="text-[11px] text-[var(--admin-text-dim)]">
            Превью в размерах сайта: десктоп в колонке 696 px, телефон 320 px. Без картинки для телефона баннер в тексте не показывается.
          </p>
        )}
      </div>
    </>
  );
}
