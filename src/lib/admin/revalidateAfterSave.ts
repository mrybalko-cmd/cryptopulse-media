import { revalidateTag } from 'next/cache';
import { after } from 'next/server';

/**
 * Сброс кэша после сохранения в админке.
 *
 * Одного сброса мало. Публичные страницы читают Sanity через CDN, а он догоняет
 * базу не сразу: 09.11.2026 галочка записалась в 12:35:17, страница пересобралась
 * в 12:35:22 уже без кэша, но со старой копией данных, и закрепила её на час.
 * Снятый рекламный блок оставался на сайте, хотя в базе всё было верно.
 *
 * Поэтому сбрасываем сразу, чтобы правка появилась как можно раньше, и ещё дважды,
 * когда CDN уже обновился. Каждый вызов after выполняет свой сброс отдельно:
 * внутри одного они накопились бы до конца и сработали разом.
 */
const RETRY_DELAYS_MS = [10_000, 25_000];

export function revalidateAfterSave(tag: string) {
  revalidateTag(tag, { expire: 0 });
  for (const delay of RETRY_DELAYS_MS) {
    after(async () => {
      await new Promise(resolve => setTimeout(resolve, delay));
      revalidateTag(tag, { expire: 0 });
    });
  }
}
