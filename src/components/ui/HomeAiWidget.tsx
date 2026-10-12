import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { HomeAiData } from '@/lib/ai';
import HomeAiDock from './HomeAiDock';

/**
 * Блок каталога AI-сервисов на главной. Стоит под блоком регуляции.
 *
 * Вход сделан через знакомый бренд, а не через список задач: читатель главной
 * ещё не формулировал запрос, он листает ленту. Ряд чужих логотипов узнаётся
 * боковым зрением и объясняет, что внутри, быстрее любой подписи.
 *
 * Рамки у панели нет. Объём держат ореолы за спиной и тонкая световая кромка
 * сверху — так же, как у стеклянных блоков в хабе: граница в один пиксель
 * рядом с размытым стеклом читается как чужая деталь.
 */

const T = {
  ru: {
    title: 'Хаб AI-сервисов в одном месте',
    hint: 'Наведите на плитку — ряд расступится',
    hintTouch: 'Листается вбок',
    cta: 'Открыть каталог',
  },
  en: {
    title: 'Every AI service in one place',
    hint: 'Point at a tile and the row steps aside',
    hintTouch: 'Swipe sideways',
    cta: 'Open the catalogue',
  },
} as const;

export default function HomeAiWidget({ data, locale }: { data: HomeAiData; locale: string }) {
  if (!data.show || data.tiles.length === 0) return null;
  const t = T[locale === 'ru' ? 'ru' : 'en'];

  return (
    /* Порядок на экране задаёт сетка, а не разметка: на широком кнопка стоит
       справа от заголовка, на узком — под плитками, куда палец дотягивается
       сам. Одна разметка, две раскладки — переставлять узлы не нужно. */
    <section className="aiw mb-8" aria-labelledby="aiw-h">
      <h2
        id="aiw-h"
        className="aiw-title text-[clamp(18px,2.4vw,26px)] font-black leading-[1.14] tracking-[-.03em]"
      >
        {t.title}
      </h2>

      <Link href={`/${locale}/ai/tools`} className="aiw-cta">
        {t.cta}
        <ArrowRight size={17} strokeWidth={2.2} />
      </Link>

      {/* Подписи две: под курсором ряд расступается, пальцем — листается.
          Показывается та, что отвечает способу ввода. */}
      <p className="aiw-hint">
        <span className="aiw-only-fine">{t.hint}</span>
        <span className="aiw-only-touch">{t.hintTouch}</span>
      </p>

      <HomeAiDock tiles={data.tiles} locale={locale} />
    </section>
  );
}
