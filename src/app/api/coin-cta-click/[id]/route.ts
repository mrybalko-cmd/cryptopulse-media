import { NextRequest, NextResponse } from 'next/server';
import { incrementAssetCtaClick } from '@/lib/sanity';

/**
 * Клик по кнопке партнёра на монете.
 *
 * Цель редиректа берётся из документа в базе, а не из запроса: принимать
 * адрес от клиента значило бы открыть дыру открытого редиректа. Параметр
 * `a` только выбирает между двумя уже записанными адресами — «Купить» и
 * «Продать».
 *
 * Если записать клик не удалось или партнёра уже нет, уводим на витрину
 * активов, а не на главную: читатель нажимал кнопку именно там.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const which = request.nextUrl.searchParams.get('a') === 'sell' ? 'sell' : 'buy';
  const target = await incrementAssetCtaClick(id, which);
  if (!target) {
    const locale = request.nextUrl.searchParams.get('l') === 'ru' ? 'ru' : 'en';
    return NextResponse.redirect(new URL(`/${locale}/assets`, request.url));
  }
  return NextResponse.redirect(target);
}
