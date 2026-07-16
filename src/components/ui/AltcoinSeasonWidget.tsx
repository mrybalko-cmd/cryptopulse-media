'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface Props {
  value: number;
  classification: 'bitcoin' | 'neutral' | 'altcoin';
  locale: string;
}

const LABELS: Record<Props['classification'], { ru: string; en: string }> = {
  bitcoin: { ru: 'Сезон биткоина', en: 'Bitcoin Season' },
  neutral: { ru: 'Нейтрально', en: 'Neutral' },
  altcoin: { ru: 'Сезон альткоинов', en: 'Altcoin Season' },
};

// Distinct palette from the Fear & Greed widget (red-to-green) so the two
// gauges are never visually confused: orange (Bitcoin's own brand color) at
// low values, gray-gold neutral, violet at high values.
function sentimentColor(v: number) {
  if (v <= 25) return '#F0883E';
  if (v <= 74) return '#D29922';
  return '#8B5CF6';
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

  const isDark = !document.documentElement.classList.contains('light') &&
    (document.documentElement.classList.contains('dark') ||
     window.matchMedia('(prefers-color-scheme: dark)').matches);
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.strokeStyle = isDark ? '#21262D' : '#E2E8F0';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();

  const segs = 40;
  const segColors = ['#F0883E', '#D29922', '#8B5CF6'];
  for (let i = 0; i < segs; i++) {
    if (i / segs >= pct) break;
    const a0 = Math.PI + (i / segs) * Math.PI;
    const a1 = Math.PI + ((i + 1) / segs) * Math.PI;
    const t = i / (segs - 1);
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

export default function AltcoinSeasonWidget({ value, classification, locale }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const color = sentimentColor(value);
  const label = LABELS[classification][locale === 'ru' ? 'ru' : 'en'];
  const href = `/${locale}/altcoin-season`;
  const indexLabel = locale === 'ru' ? 'Альткоин-сезон' : 'Altcoin Season';

  useEffect(() => {
    if (!canvasRef.current) return;
    drawArc(canvasRef.current, value);
  }, [value]);

  return (
    <Link href={href} className="group outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm">
      <div className="hidden sm:flex flex-col items-center gap-0">
        <canvas ref={canvasRef} width={96} height={56} className="block" aria-hidden="true" />
        <div className="flex items-baseline gap-1.5 -mt-1">
          <span className="font-mono text-xl font-bold tabular-nums leading-none" style={{ color }}>
            {value}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide leading-none" style={{ color }}>
            {label}
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-muted/60 mt-1 group-hover:text-accent transition-colors">
          {indexLabel} ↗
        </span>
        <span className="text-[8px] text-muted/50 mt-0.5">
          {locale === 'ru' ? 'расчёт CryptoPulse по CoinGecko' : 'CryptoPulse calc via CoinGecko'}
        </span>
      </div>

      <div className="sm:hidden flex flex-col items-center gap-1">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors"
          style={{ borderColor: `${color}33`, backgroundColor: `${color}0F` }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="font-mono text-xs font-bold tabular-nums" style={{ color }}>{value}</span>
          <span className="text-[10px] font-medium" style={{ color }}>{label}</span>
        </div>
        <span className="text-[8px] text-muted/50">
          {locale === 'ru' ? 'расчёт CryptoPulse по CoinGecko' : 'CryptoPulse calc via CoinGecko'}
        </span>
      </div>
    </Link>
  );
}
