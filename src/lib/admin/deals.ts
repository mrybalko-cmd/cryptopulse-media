import { adminClient as client, writeClient } from '@/lib/sanity';
import type { Deal, DealInput } from './dealMath';

export * from './dealMath';

/**
 * Учёт коммерческих размещений. Только для владельца, только в админке.
 *
 * Считаем здесь, а не в компоненте, по одной причине: одни и те же цифры
 * показываются на экране и уезжают в выгрузку, и разойтись они не должны.
 * Если итог в Excel не сходится с итогом на экране, верить перестают обоим.
 */

/* ── Чтение и запись ──────────────────────────────────────────────── */

const DEAL_FIELDS = `_id, client, dealDate, source, partner, status, paidAt, invoiceNo,
  currency, "fxToEur": coalesce(fxToEur, 1), "commissionPct": coalesce(commissionPct, 0),
  "placements": coalesce(placements[]{ _key, kind, customKind, amount, url, note }, []), notes`;

/**
 * Сделки за период. Границы включаются обе: пользователь, выбравший
 * 1–31 октября, ждёт в отчёте и первое, и тридцать первое.
 */
export async function fetchDeals(from: string, to: string): Promise<Deal[]> {
  return client.fetch<Deal[]>(
    `*[_type == "adDeal" && dealDate >= $from && dealDate <= $to] | order(dealDate desc) { ${DEAL_FIELDS} }`,
    { from, to }
  );
}

export async function fetchDealById(id: string): Promise<Deal | null> {
  return client.fetch<Deal | null>(`*[_type == "adDeal" && _id == $id][0]{ ${DEAL_FIELDS} }`, { id });
}

/** Самая ранняя и самая поздняя дата в базе — чтобы предложить «за всё время». */
export async function fetchDealRange(): Promise<{ first: string | null; last: string | null }> {
  return client.fetch(`{
    "first": *[_type == "adDeal" && defined(dealDate)] | order(dealDate asc)[0].dealDate,
    "last":  *[_type == "adDeal" && defined(dealDate)] | order(dealDate desc)[0].dealDate
  }`);
}

function docFields(input: DealInput) {
  return {
    client: input.client.trim(),
    dealDate: input.dealDate,
    source: input.source,
    // Пустая строка в базе хуже отсутствующего поля: она проходит проверку
    // «заполнено» и потом всплывает пустым местом в отчёте.
    partner: input.source === 'direct' ? undefined : input.partner?.trim() || undefined,
    status: input.status,
    paidAt: input.status === 'paid' ? input.paidAt || undefined : undefined,
    invoiceNo: input.invoiceNo?.trim() || undefined,
    currency: input.currency,
    fxToEur: input.fxToEur,
    commissionPct: input.commissionPct,
    placements: input.placements.map((p, i) => ({
      _key: p._key || `p${i}${Math.random().toString(36).slice(2, 8)}`,
      _type: 'adPlacement',
      kind: p.kind,
      customKind: p.customKind?.trim() || undefined,
      amount: p.amount,
      url: p.url?.trim() || undefined,
      note: p.note?.trim() || undefined,
    })),
    notes: input.notes?.trim() || undefined,
  };
}

export async function createDeal(input: DealInput) {
  return writeClient.create({ _type: 'adDeal', ...docFields(input) });
}

export async function updateDeal(id: string, input: DealInput) {
  const fields = docFields(input);
  const unset = Object.entries(fields)
    .filter(([, v]) => v === undefined)
    .map(([k]) => k);
  let patch = writeClient.patch(id).set(fields);
  if (unset.length) patch = patch.unset(unset);
  await patch.commit({ autoGenerateArrayKeys: false });
}

export async function deleteDeal(id: string) {
  await writeClient.delete(id);
}
