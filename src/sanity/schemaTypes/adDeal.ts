import { defineField, defineType } from 'sanity';

/**
 * Коммерческая сделка: кто заплатил, за что и сколько осталось нам.
 *
 * Документ закрыт для всех, кроме владельца, — он живёт только в админке под
 * `requireOwner`, в Studio его не показываем. Поэтому тут нет двуязычия и
 * оформительских полей: это учётная запись, а не материал сайта.
 *
 * Три решения, которые стоит объяснить, потому что они неочевидны и без них
 * отчёт начинает врать.
 *
 * 1. Размещения лежат массивом внутри сделки. Одна оплата часто покрывает
 *    баннер, статью и рассылку сразу; если разложить их на три сделки, клиент
 *    посчитается трижды, а если слить в одну сумму — пропадёт разрез по
 *    форматам. Массив даёт и то и другое.
 *
 * 2. Курс к евро хранится в сделке, а не берётся на лету. Курс на сегодня
 *    пересчитывает и прошлый месяц тоже, и закрытый отчёт за март в апреле
 *    показывает другую цифру. Курс фиксируется датой сделки и больше не
 *    меняется.
 *
 * 3. USDT и USDC считаются как доллар. Это допущение, а не истина: на бирже
 *    они ходят с отклонением в доли процента. Оно написано на экране отчёта
 *    открытым текстом, чтобы не выглядело точным расчётом.
 */

export const adPlacementType = defineType({
  name: 'adPlacement',
  title: 'Размещение',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Вид размещения',
      type: 'string',
      initialValue: 'banner',
      options: {
        list: [
          { title: 'Баннер', value: 'banner' },
          { title: 'Статья', value: 'article' },
          { title: 'Новость', value: 'news' },
          { title: 'Пакет PR', value: 'pr' },
          { title: 'Карточка в каталоге AI', value: 'aiCard' },
          { title: 'Карточка биржи', value: 'exchange' },
          { title: 'Рассылка', value: 'newsletter' },
          { title: 'Пост в соцсетях', value: 'social' },
          { title: 'Виджет на главной', value: 'homeWidget' },
          { title: 'Другое', value: 'other' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Сумма',
      type: 'number',
      description: 'В валюте сделки. Складывается с остальными размещениями в итог.',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'url',
      title: 'Ссылка на размещение',
      type: 'url',
      description: 'Адрес опубликованного материала или баннера. Нужен, чтобы через полгода не искать, за что платили.',
    }),
    defineField({
      name: 'note',
      title: 'Пометка',
      type: 'string',
      description: 'Коротко: «две недели в сайдбаре», «пакет из трёх статей».',
    }),
  ],
  preview: {
    select: { kind: 'kind', amount: 'amount', note: 'note' },
    prepare: ({ kind, amount, note }) => ({
      title: `${kind ?? 'размещение'} · ${amount ?? 0}`,
      subtitle: note,
    }),
  },
});

export const adDealType = defineType({
  name: 'adDeal',
  title: 'Коммерческая сделка',
  type: 'document',
  groups: [
    { name: 'main', title: 'Сделка', default: true },
    { name: 'money', title: 'Деньги' },
    { name: 'items', title: 'Размещения' },
  ],
  fields: [
    defineField({
      name: 'client',
      title: 'Клиент',
      type: 'string',
      group: 'main',
      description: 'Название компании так, как она подписывает счёт.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'dealDate',
      title: 'Дата сделки',
      type: 'date',
      group: 'main',
      options: { dateFormat: 'DD.MM.YYYY' },
      description: 'По ней сделка попадает в отчёт за период и по ней зафиксирован курс.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Откуда клиент',
      type: 'string',
      group: 'main',
      initialValue: 'direct',
      options: {
        list: [
          { title: 'Прямой', value: 'direct' },
          { title: 'Через рекламное агентство', value: 'agency' },
          { title: 'Через агента', value: 'agent' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'partner',
      title: 'Агентство или агент',
      type: 'string',
      group: 'main',
      description: 'Заполняется, если клиент пришёл не напрямую.',
      hidden: ({ parent }) => parent?.source === 'direct',
    }),
    defineField({
      name: 'status',
      title: 'Состояние',
      type: 'string',
      group: 'main',
      initialValue: 'invoiced',
      options: {
        list: [
          { title: 'Договорились', value: 'planned' },
          { title: 'Счёт выставлен', value: 'invoiced' },
          { title: 'Оплачено', value: 'paid' },
          { title: 'Отменено', value: 'cancelled' },
        ],
      },
    }),
    defineField({
      name: 'paidAt',
      title: 'Дата оплаты',
      type: 'date',
      group: 'main',
      options: { dateFormat: 'DD.MM.YYYY' },
      hidden: ({ parent }) => parent?.status !== 'paid',
    }),
    defineField({
      name: 'invoiceNo',
      title: 'Номер счёта',
      type: 'string',
      group: 'main',
    }),

    defineField({
      name: 'currency',
      title: 'Валюта',
      type: 'string',
      group: 'money',
      initialValue: 'EUR',
      options: {
        list: [
          { title: 'EUR — евро', value: 'EUR' },
          { title: 'USD — доллар', value: 'USD' },
          { title: 'USDT', value: 'USDT' },
          { title: 'USDC', value: 'USDC' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'fxToEur',
      title: 'Курс к евро на дату сделки',
      type: 'number',
      group: 'money',
      initialValue: 1,
      description:
        'Сколько евро в одной единице валюты сделки. Для евро — единица. ' +
        'Ставится один раз и больше не меняется: курс на сегодня пересчитал бы ' +
        'и закрытые месяцы, и отчёт за март в апреле показал бы другую цифру.',
      validation: Rule => Rule.required().min(0.0001),
    }),
    defineField({
      name: 'commissionPct',
      title: 'Комиссия агентству или агенту, %',
      type: 'number',
      group: 'money',
      initialValue: 0,
      description: 'Вычитается из суммы размещений. Итог — то, что остаётся нам.',
      validation: Rule => Rule.min(0).max(100),
    }),

    defineField({
      name: 'placements',
      title: 'Размещения',
      type: 'array',
      of: [{ type: 'adPlacement' }],
      group: 'items',
      description:
        'Одна сделка может покрывать несколько форматов сразу. Сумма сделки ' +
        'складывается отсюда, поэтому отдельного поля «сколько всего» нет: ' +
        'иначе оно разъедется со строками при первой же правке.',
      validation: Rule => Rule.required().min(1).error('В сделке нет ни одного размещения'),
    }),

    defineField({
      name: 'notes',
      title: 'Заметки',
      type: 'text',
      rows: 3,
      group: 'main',
    }),
  ],
  orderings: [
    { title: 'Сначала новые', name: 'dateDesc', by: [{ field: 'dealDate', direction: 'desc' }] },
    { title: 'По клиенту', name: 'client', by: [{ field: 'client', direction: 'asc' }] },
  ],
  preview: {
    select: { client: 'client', date: 'dealDate', cur: 'currency', placements: 'placements', status: 'status' },
    prepare: ({ client, date, cur, placements, status }) => {
      const total = (placements ?? []).reduce(
        (sum: number, p: { amount?: number }) => sum + (p?.amount ?? 0),
        0
      );
      return {
        title: `${client ?? 'без клиента'} · ${total} ${cur ?? ''}`,
        subtitle: `${date ?? 'без даты'} · ${status ?? ''} · размещений: ${placements?.length ?? 0}`,
      };
    },
  },
});
