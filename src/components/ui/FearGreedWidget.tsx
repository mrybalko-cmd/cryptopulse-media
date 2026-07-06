'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface Props {
  value: number;
  classification: string;
  locale: string;
}

const LABELS: Record<string, { ru: string; en: string }> = {
  'Extreme Fear': { ru: 'Крайний страх', en: 'Extreme Fear' },
  'Fear':         { ru: 'Страх',         en: 'Fear' },
  'Neutral':      { ru: 'Нейтрально',    en: 'Neutral' },
  'Greed':        { ru: 'Жадность',      en: 'Greed' },
  'Extreme Greed':{ ru: 'Крайняя жадность', en: 'Extreme Greed' },
};

function sentimentColor(v: number) {
  if (v <= 24) return '#E5534B';
  if (v <= 44) return '#F0883E';
  if (v <= 55) return '#D29922';
  if (v <= 74) return '#3FB950';
  return '#2EA043';
}

function drawArc(canvas: HTMLCanvasElement, value: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  const cx = W / 2;
  const cy = H - 4;
  const r = W / 2 - 7;
  const pct = value / 100;
  const color = sentimentColor(value);

  ctx.clearRect(0, 0, W, H);

  // track (background arc)
  const isDark = !document.documentElement.classList.contains('light') &&
    (document.documentElement.classList.contains('dark') ||
     window.matchMedia('(prefers-color-scheme: dark)').matches);
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.strokeStyle = isDark ? '#21262D' : '#E2E8F0';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // colored segments from left (fear) to right (greed)
  const segs = 40;
  for (let i = 0; i < segs; i++) {
    if (i / segs >= pct) break;
    const a0 = Math.PI + (i / segs) * Math.PI;
    const a1 = Math.PI + ((i + 1) / segs) * Math.PI;
    const t = i / (segs - 1);
    // interpolate: red→orange→yellow→green
    const segColors = ['#E5534B','#F0883E','#D29922','#3FB950','#2EA043'];
    const idx = Math.min(Math.floor(t * (segColors.length - 1)), segColors.length - 2);
    const frac = t * (segColors.length - 1) - idx;
    const c0 = hexToRgb(segColors[idx]);
    const c1 = hexToRgb(segColors[idx + 1]);
    const r2 = Math.round(c0[0] + (c1[0] - c0[0]) * frac);
    const g2 = Math.round(c0[1] + (c1[1] - c0[1]) * frac);
    const b2 = Math.round(c0[2] + (c1[2] - c0[2]) * frac);
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1);
    ctx.strokeStyle = `rgb(${r2},${g2},${b2})`;
    ctx.lineWidth = 5;
    ctx.lineCap = 'butt';
    ctx.stroke();
  }

  // glow + needle dot
  const needleAngle = Math.PI + pct * Math.PI;
  const nx = cx + r * Math.cos(needleAngle);
  const ny = cy + r * Math.sin(needleAngle);

  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(nx, ny, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function FearGreedWidget({ value, classification, locale }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const color = sentimentColor(value);
  const label = LABELS[classification]?.[locale === 'ru' ? 'ru' : 'en'] ?? classification;
  const href = `/${locale}/fear-greed`;
  const indexLabel = locale === 'ru' ? 'Индекс страха' : 'Fear & Greed';

  useEffect(() => {
    if (!canvasRef.current) return;
    drawArc(canvasRef.current, value);
  }, [value]);

  return (
    <Link href={href} className="group outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm">
      {/* Desktop: full arc widget */}
      <div className="hidden sm:flex flex-col items-center gap-0">
        <canvas
          ref={canvasRef}
          width={96}
          height={56}
          className="block"
          aria-hidden="true"
        />
        <div className="flex items-baseline gap-1.5 -mt-1">
          <span
            className="font-mono text-xl font-bold tabular-nums leading-none"
            style={{ color }}
          >
            {value}
          </span>
          <span
            className="text-[10px] font-semibold uppercase tracking-wide leading-none"
            style={{ color }}
          >
            {label}
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-muted/60 mt-1 group-hover:text-accent transition-colors">
          {indexLabel} ↗
        </span>
      </div>

      {/* Mobile: compact pill — just number + label + colored dot */}
      <div
        className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors"
        style={{
          borderColor: `${color}33`,
          backgroundColor: `${color}0F`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span
          className="font-mono text-xs font-bold tabular-nums"
          style={{ color }}
        >
          {value}
        </span>
        <span className="text-[10px] font-medium" style={{ color }}>
          {label}
        </span>
      </div>
    </Link>
  );
}
