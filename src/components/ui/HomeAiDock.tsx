'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import type { AiTile } from '@/lib/ai';

/**
 * Ряд логотипов, который расступается под курсором.
 *
 * Эффект завязан на указатель: плитка растёт от того места, где он стоит, а
 * соседи отодвигаются. На телефоне указателя нет, и приём там не ломается —
 * его просто некому запустить. Поэтому на узких экранах плитки остаются в
 * покое, перекрытые и наклонённые, и этот покой и есть рисунок. Ряд там
 * листается вбок с привязкой.
 *
 * Разметка одна на обе ширины, различия держит CSS. Обработчики вешаются
 * только там, где эффект работает: при `prefers-reduced-motion` и на
 * сенсорных экранах их нет вовсе — не только анимации, но и самой подписки
 * на события. Подпись с названием сервиса — тоже примета указателя: на
 * телефоне она скрыта правилом в стилях, потому что ярлык под собственным
 * пальцем бесполезен.
 */

const TILT = [-7, 5, -4, 8, -6, 4, -8, 6, -3, 7, -5, 6];
/** Насколько плитка вырастает, как далеко тянется влияние, высота подскока. */
const MAG = 0.3, REACH = 1.2, LIFT = 0.19, OVER = 0.14;

export default function HomeAiDock({ tiles, locale }: { tiles: AiTile[]; locale: string }) {
  const railRef = useRef<HTMLUListElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const geom = useRef<{ w: number; centers: number[] }>({ w: 0, centers: [] });

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const slots = [...rail.children] as HTMLElement[];
    geom.current = {
      w: slots[0]?.offsetWidth ?? 0,
      centers: slots.map(s => s.offsetLeft + s.offsetWidth / 2),
    };
  }, []);

  const move = useCallback((x: number) => {
    const rail = railRef.current;
    const tip = tipRef.current;
    if (!rail) return;
    const { w, centers } = geom.current;
    const slots = [...rail.children] as HTMLElement[];

    const swell = (i: number) => {
      const c = centers[i];
      if (!Number.isFinite(x) || c === undefined || !w) return 0;
      return Math.max(0, 1 - Math.abs(x - c) / w / REACH) ** 2;
    };

    const room = OVER + MAG / 2;
    let near = 0;
    slots.forEach((slot, i) => {
      const v = swell(i);
      let push = 0;
      for (let k = 0; k < slots.length; k += 1) if (k !== i) push += swell(k) * (k < i ? 1 : -1);
      const el = slot.querySelector<HTMLElement>('.aiw-tile');
      if (el) {
        el.style.transform = `translateX(${push * w * room}px) translateY(${-v * LIFT * w}px) scale(${1 + v * MAG})`;
        el.style.rotate = `${TILT[i % TILT.length] * (1 - v)}deg`;
      }
      if (Number.isFinite(x) && Math.abs(x - centers[i]) < Math.abs(x - centers[near])) near = i;
    });

    if (!tip) return;
    if (Number.isFinite(x) && centers.length) {
      tip.textContent = tiles[near]?.name ?? '';
      tip.style.translate = `calc(${centers[near]}px - 50%) 0`;
      tip.classList.add('on');
    } else {
      tip.classList.remove('on');
    }
  }, [tiles]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    measure();
    const at = (e: PointerEvent) => e.clientX - rail.getBoundingClientRect().left;
    const onMove = (e: PointerEvent) => move(at(e));
    const onLeave = () => move(Infinity);
    const onResize = () => { measure(); move(Infinity); };

    rail.addEventListener('pointermove', onMove);
    rail.addEventListener('pointerdown', onMove);
    rail.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    return () => {
      rail.removeEventListener('pointermove', onMove);
      rail.removeEventListener('pointerdown', onMove);
      rail.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [measure, move]);

  return (
    <div className="aiw-dock">
      <span className="aiw-tip" ref={tipRef} aria-hidden="true" />
      <ul className="aiw-rail" ref={railRef} role="list">
        {tiles.map((t, i) => (
          <li key={t.slug} className="aiw-slot" style={{ zIndex: tiles.length - i }}>
            <Link href={`/${locale}/ai/tools/${t.slug}`} aria-label={t.name}>
              <span
                className="aiw-tile"
                style={{
                  background: t.logoUrl ? (t.logoOnDark ? '#15161a' : '#ffffff') : t.brandColor,
                  rotate: `${TILT[i % TILT.length]}deg`,
                }}
              >
                {t.logoUrl ? (
                  <Image src={t.logoUrl} alt="" width={96} height={96} />
                ) : (
                  t.monogram
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
