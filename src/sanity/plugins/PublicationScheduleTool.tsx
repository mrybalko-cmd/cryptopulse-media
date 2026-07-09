import { useEffect, useState, useCallback } from 'react';
import { useClient } from 'sanity';
import {
  Box, Card, Flex, Stack, Text, Badge, Spinner, Button, Heading,
} from '@sanity/ui';
import { CalendarIcon, SyncIcon, EditIcon, ClockIcon, CheckmarkIcon, CloseIcon } from '@sanity/icons';

type Item = {
  _id: string;
  _type: 'news' | 'article';
  title: string;
  language: 'ru' | 'en';
  publishedAt?: string;
  _updatedAt?: string;
};

type LikedItem = Item & { likes: number; views: number };

type DashboardData = {
  scheduled: Item[];
  recent: Item[];
  drafts: Item[];
  recentTotal: number;
  draftsTotal: number;
  dailyPublishedDates: string[];
  topLiked: LikedItem[];
};

const TREND_DAYS = 30;

// "recent" and "drafts" are sliced for the on-screen list only — the counts
// shown in the header badges come from the separate count(...) totals below,
// since data.recent.length/data.drafts.length would otherwise be capped at
// the slice size regardless of how many items actually exist.
//
// "dailyPublishedDates" powers the per-day trend chart — fetched separately
// (bounded by $windowStart) rather than derived from "recent" because
// "recent" is capped at 60 items and would silently under-count days once
// publishing volume exceeds that within the trend window.
const QUERY = `{
  "scheduled": *[_type in ["news", "article"] && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt > now()] | order(publishedAt asc) {
    _id, _type, title, language, publishedAt
  },
  "recent": *[_type in ["news", "article"] && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [0...60] {
    _id, _type, title, language, publishedAt
  },
  "recentTotal": count(*[_type in ["news", "article"] && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now()]),
  "drafts": *[_type in ["news", "article"] && _id in path("drafts.**")] | order(_updatedAt desc) [0...15] {
    _id, _type, title, language, _updatedAt
  },
  "draftsTotal": count(*[_type in ["news", "article"] && _id in path("drafts.**")]),
  "dailyPublishedDates": *[_type in ["news", "article"] && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now() && publishedAt >= $windowStart].publishedAt,
  "topLiked": *[_type in ["news", "article"] && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now() && coalesce(likes, 0) > 0] | order(likes desc) [0...10] {
    _id, _type, title, language, publishedAt, "likes": coalesce(likes, 0), "views": coalesce(views, 0)
  }
}`;

const RU_MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
const RU_MONTHS_FULL = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const RU_WEEKDAYS = ['вс','пн','вт','ср','чт','пт','сб'];
const RU_WEEKDAYS_FULL = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];

const DAYS = 15;

function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text;
  const cut = text.lastIndexOf(' ', max);
  return (cut > max * 0.6 ? text.slice(0, cut) : text.slice(0, max)) + '…';
}

function toDateKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function fmtDayFull(d: Date) {
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const key = toDateKey(d.toISOString());
  if (key === toDateKey(today.toISOString())) return `Сегодня, ${d.getDate()} ${RU_MONTHS_FULL[d.getMonth()]}`;
  if (key === toDateKey(tomorrow.toISOString())) return `Завтра, ${d.getDate()} ${RU_MONTHS_FULL[d.getMonth()]}`;
  return `${RU_WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()} ${RU_MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (toDateKey(iso) === toDateKey(today.toISOString())) return 'Сегодня';
  if (toDateKey(iso) === toDateKey(tomorrow.toISOString())) return 'Завтра';
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtRelative(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const d = Math.floor(abs / 86400000);
  const h = Math.floor(abs / 3600000);
  const m = Math.floor(abs / 60000);
  if (diff > 0) {
    if (d >= 1) return `через ${d} дн.`;
    if (h >= 1) return `через ${h} ч.`;
    return `через ${m} мин.`;
  }
  if (d >= 1) return `${d} дн. назад`;
  if (h >= 1) return `${h} ч. назад`;
  return `${m} мин. назад`;
}

function groupByDate(items: Item[], field: 'publishedAt' | '_updatedAt' = 'publishedAt') {
  const result: { label: string; rawDate: string; items: Item[] }[] = [];
  const seen = new Map<string, Item[]>();
  items.forEach(item => {
    const val = item[field];
    if (!val) return;
    const label = fmtDateLabel(val);
    if (!seen.has(label)) {
      seen.set(label, []);
      result.push({ label, rawDate: val, items: seen.get(label)! });
    }
    seen.get(label)!.push(item);
  });
  return result;
}

function docHref(item: Item) {
  return `/studio/intent/edit/id=${item._id};type=${item._type}/`;
}

type DayCount = { day: Date; key: string; count: number };

function buildDailyCounts(dates: string[], days: number): DayCount[] {
  const counts = new Map<string, number>();
  dates.forEach(iso => {
    const key = toDateKey(iso);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const key = toDateKey(d.toISOString());
    return { day: d, key, count: counts.get(key) || 0 };
  });
}

// ── Activity panel: daily trend + top liked, side by side ─────────────────────

function ActivityPanel({ trend, liked }: { trend: DayCount[]; liked: LikedItem[] }) {
  const max = Math.max(1, ...trend.map(d => d.count));
  const total = trend.reduce((s, d) => s + d.count, 0);
  const avg = trend.length ? (total / trend.length).toFixed(1) : '0';
  const todayKey = toDateKey(new Date().toISOString());

  return (
    <Card padding={4} radius={3} shadow={1}>
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {/* Daily trend chart */}
        <Box style={{ flex: '2 1 380px', minWidth: 0 }}>
          <Flex align="center" justify="space-between" marginBottom={3} style={{ flexWrap: 'wrap', gap: 12 }}>
            <Flex align="center" gap={2}>
              <Box style={{ color: '#15803D' }}><CheckmarkIcon /></Box>
              <Text size={1} weight="bold">Динамика — {trend.length} дн.</Text>
            </Flex>
            <Flex gap={3} align="center">
              <Text size={1} muted>
                Всего: <Text as="span" size={1} weight="semibold">{total}</Text>
              </Text>
              <Text size={1} muted>
                Среднее: <Text as="span" size={1} weight="semibold">{avg}/день</Text>
              </Text>
            </Flex>
          </Flex>
          <Box style={{ overflowX: 'auto', paddingBottom: 4 }}>
            <Flex gap={1} align="flex-end" style={{ minWidth: 'max-content', height: 130 }}>
              {trend.map(({ day, key, count }) => {
                const isToday = key === todayKey;
                const barHeight = count === 0 ? 2 : Math.max(6, (count / max) * 88);
                return (
                  <Flex
                    key={key}
                    direction="column"
                    align="center"
                    justify="flex-end"
                    style={{ minWidth: 24, height: '100%' }}
                    title={`${fmtDayFull(day)}: ${count} опубликовано`}
                  >
                    <Text size={0} weight="semibold" style={{ marginBottom: 2, height: 14, color: count > 0 ? 'inherit' : 'transparent' }}>
                      {count}
                    </Text>
                    <Box
                      style={{
                        width: 14,
                        height: barHeight,
                        borderRadius: 3,
                        background: count > 0 ? (isToday ? '#2276FC' : '#15803D') : 'var(--card-border-color)',
                      }}
                    />
                    <Text size={0} muted style={{ marginTop: 4, fontSize: 9, whiteSpace: 'nowrap' }}>
                      {day.getDate()}.{String(day.getMonth() + 1).padStart(2, '0')}
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
          </Box>
        </Box>

        {/* Divider */}
        <Box style={{ width: 1, background: 'var(--card-border-color)', alignSelf: 'stretch' }} />

        {/* Top liked — scrollable so the panel height stays fixed regardless of list length */}
        <Box style={{ flex: '1 1 280px', minWidth: 240 }}>
          <Flex align="center" gap={2} marginBottom={3}>
            <Box style={{ color: '#DC2626' }}>❤</Box>
            <Text size={1} weight="bold">Топ по лайкам</Text>
          </Flex>
          {liked.length > 0 ? (
            <Stack space={1} style={{ maxHeight: 172, overflowY: 'auto' }}>
              {liked.map((item, i) => (
                <a key={item._id} href={docHref(item)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <Flex
                    align="center"
                    gap={2}
                    style={{ padding: '6px 8px', borderRadius: 6, cursor: 'pointer' }}
                  >
                    <Text size={1} weight="bold" muted style={{ minWidth: 16, flexShrink: 0 }}>{i + 1}</Text>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size={1} style={{ lineHeight: 1.4 }}>
                        {truncate(item.title || '(без названия)', 60)}
                      </Text>
                    </Box>
                    <Badge tone={item.language === 'ru' ? 'primary' : 'default'} fontSize={0} style={{ flexShrink: 0 }}>
                      {item.language.toUpperCase()}
                    </Badge>
                    <Text size={1} weight="semibold" style={{ color: '#DC2626', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {item.likes} ❤
                    </Text>
                  </Flex>
                </a>
              ))}
            </Stack>
          ) : (
            <Text size={1} muted>Пока нет лайков</Text>
          )}
        </Box>
      </Flex>
    </Card>
  );
}

// ── Calendar strip ────────────────────────────────────────────────────────────

function DayStrip({
  scheduled,
  recent,
  selectedKey,
  onSelect,
}: {
  scheduled: Item[];
  recent: Item[];
  selectedKey: string | null;
  onSelect: (key: string, date: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduledByKey = new Map<string, number>();
  scheduled.forEach(item => {
    if (!item.publishedAt) return;
    const k = toDateKey(item.publishedAt);
    scheduledByKey.set(k, (scheduledByKey.get(k) || 0) + 1);
  });

  const recentByKey = new Map<string, number>();
  recent.forEach(item => {
    if (!item.publishedAt) return;
    const k = toDateKey(item.publishedAt);
    recentByKey.set(k, (recentByKey.get(k) || 0) + 1);
  });

  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  // Past days: show last 7 days before today too
  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (7 - i));
    return d;
  });

  const allDays = [...pastDays, ...days];

  return (
    <Box style={{ overflowX: 'auto', paddingBottom: 4 }}>
      <Flex gap={1} style={{ minWidth: 'max-content' }}>
        {allDays.map((date) => {
          const k = toDateKey(date.toISOString());
          const schCount = scheduledByKey.get(k) || 0;
          const pubCount = recentByKey.get(k) || 0;
          const isToday = k === toDateKey(today.toISOString());
          const isSelected = k === selectedKey;
          const isPast = date < today;

          return (
            <button
              key={k}
              onClick={() => onSelect(k, date)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: '8px 6px 6px',
                borderRadius: 8,
                border: isSelected
                  ? '2px solid #2276FC'
                  : isToday
                  ? '1px solid rgba(34,118,252,0.35)'
                  : '1px solid transparent',
                background: isSelected
                  ? 'rgba(34,118,252,0.12)'
                  : isToday
                  ? 'rgba(34,118,252,0.05)'
                  : (schCount > 0 || pubCount > 0)
                  ? 'rgba(255,255,255,0.03)'
                  : 'transparent',
                cursor: 'pointer',
                minWidth: 44,
                outline: 'none',
                opacity: isPast && !isToday ? 0.65 : 1,
                transition: 'background 0.12s, border-color 0.12s',
              }}
            >
              <span style={{
                fontSize: 10,
                lineHeight: 1.2,
                textTransform: 'uppercase',
                color: isSelected ? '#2276FC' : 'var(--card-muted-fg-color)',
                fontWeight: isToday ? 700 : 400,
              }}>
                {RU_WEEKDAYS[date.getDay()]}
              </span>
              <span style={{
                fontSize: 14,
                lineHeight: 1.4,
                fontWeight: isToday || isSelected ? 700 : 400,
                color: isSelected ? '#2276FC' : isToday ? '#2276FC' : 'inherit',
              }}>
                {date.getDate()}
              </span>
              <span style={{
                fontSize: 9,
                color: 'var(--card-muted-fg-color)',
                lineHeight: 1,
              }}>
                {RU_MONTHS[date.getMonth()]}
              </span>
              {/* Dots: blue = scheduled, green = published */}
              <Flex gap={1} justify="center" style={{ height: 8, marginTop: 2 }}>
                {schCount > 0 && (
                  <Box style={{
                    width: Math.min(schCount, 3) * 4 + 4,
                    height: 5,
                    borderRadius: 3,
                    background: '#2276FC',
                    minWidth: 5,
                  }} />
                )}
                {pubCount > 0 && (
                  <Box style={{
                    width: Math.min(pubCount, 3) * 4 + 4,
                    height: 5,
                    borderRadius: 3,
                    background: '#15803D',
                    minWidth: 5,
                  }} />
                )}
              </Flex>
            </button>
          );
        })}
      </Flex>
      {/* Legend */}
      <Flex gap={4} style={{ marginTop: 8, paddingLeft: 2 }}>
        <Flex align="center" gap={1}>
          <Box style={{ width: 8, height: 5, borderRadius: 3, background: '#2276FC' }} />
          <Text size={0} muted>запланировано</Text>
        </Flex>
        <Flex align="center" gap={1}>
          <Box style={{ width: 8, height: 5, borderRadius: 3, background: '#15803D' }} />
          <Text size={0} muted>опубликовано</Text>
        </Flex>
      </Flex>
    </Box>
  );
}

// ── Day detail panel ──────────────────────────────────────────────────────────

function DayPanel({
  date,
  scheduled,
  recent,
  onClose,
}: {
  date: Date;
  scheduled: Item[];
  recent: Item[];
  onClose: () => void;
}) {
  const key = toDateKey(date.toISOString());

  const dayScheduled = scheduled.filter(i => i.publishedAt && toDateKey(i.publishedAt) === key);
  const dayPublished = recent.filter(i => i.publishedAt && toDateKey(i.publishedAt) === key);
  const total = dayScheduled.length + dayPublished.length;

  return (
    <Card padding={4} radius={3} shadow={1} tone={total > 0 ? 'primary' : 'default'} style={{ borderLeft: '3px solid #2276FC' }}>
      <Flex align="center" justify="space-between" marginBottom={3}>
        <Flex align="center" gap={2}>
          <CalendarIcon style={{ color: '#2276FC' }} />
          <Text size={2} weight="bold" style={{ textTransform: 'capitalize' }}>
            {fmtDayFull(date)}
          </Text>
          {total === 0 && <Text size={1} muted>— ничего не запланировано</Text>}
        </Flex>
        <Button
          icon={CloseIcon}
          mode="ghost"
          tone="default"
          padding={2}
          onClick={onClose}
          title="Закрыть"
        />
      </Flex>

      {total === 0 ? (
        <Flex align="center" justify="center" style={{ padding: '20px 0' }}>
          <Text size={1} muted style={{ fontStyle: 'italic' }}>
            В этот день нет запланированных или опубликованных материалов
          </Text>
        </Flex>
      ) : (
        <Flex gap={4} style={{ flexWrap: 'wrap' }} align="flex-start">
          {dayScheduled.length > 0 && (
            <Box style={{ flex: '1 1 300px' }}>
              <Flex align="center" gap={2} marginBottom={2}>
                <ClockIcon style={{ color: '#2276FC', fontSize: 14 }} />
                <Text size={1} weight="semibold" style={{ color: '#2276FC' }}>
                  Запланировано ({dayScheduled.length})
                </Text>
              </Flex>
              {dayScheduled.map(item => <ItemRow key={item._id} item={item} />)}
            </Box>
          )}
          {dayPublished.length > 0 && (
            <Box style={{ flex: '1 1 300px' }}>
              <Flex align="center" gap={2} marginBottom={2}>
                <CheckmarkIcon style={{ color: '#15803D', fontSize: 14 }} />
                <Text size={1} weight="semibold" style={{ color: '#15803D' }}>
                  Опубликовано ({dayPublished.length})
                </Text>
              </Flex>
              {dayPublished.map(item => <ItemRow key={item._id} item={item} />)}
            </Box>
          )}
        </Flex>
      )}
    </Card>
  );
}

// ── Item row ──────────────────────────────────────────────────────────────────

function ItemRow({ item }: { item: Item }) {
  const isArticle = item._type === 'article';
  const isFuture = item.publishedAt && new Date(item.publishedAt) > new Date();

  return (
    <a href={docHref(item)} style={{ textDecoration: 'none', display: 'block' }}>
      <Flex
        gap={2}
        align="flex-start"
        style={{
          padding: '10px 12px',
          borderRadius: 8,
          borderLeft: `3px solid ${isArticle ? '#1469F7' : '#E85D04'}`,
          background: 'var(--card-bg-color)',
          marginBottom: 6,
          cursor: 'pointer',
        }}
      >
        <Flex gap={1} style={{ flexShrink: 0, paddingTop: 2 }}>
          <Badge
            tone={isArticle ? 'primary' : 'caution'}
            fontSize={0}
            padding={1}
            style={{ whiteSpace: 'nowrap' }}
          >
            {isArticle ? 'Статья' : 'Новость'}
          </Badge>
          <Badge
            tone={item.language === 'ru' ? 'positive' : 'default'}
            fontSize={0}
            padding={1}
          >
            {item.language.toUpperCase()}
          </Badge>
        </Flex>

        <Box flex={1} style={{ minWidth: 0 }}>
          <Text size={1} weight="semibold" style={{ lineHeight: 1.45 }}>
            {truncate(item.title || '(без названия)', 90)}
          </Text>
          {item.publishedAt && (
            <Flex align="center" gap={2} style={{ marginTop: 4 }}>
              <Text size={1} style={{ opacity: 0.75 }}>
                {fmtDateTime(item.publishedAt)}
              </Text>
              {isFuture && (
                <Text size={1} weight="semibold" style={{ color: '#F59E0B' }}>
                  {fmtRelative(item.publishedAt)}
                </Text>
              )}
            </Flex>
          )}
          {!item.publishedAt && item._updatedAt && (
            <Text size={1} style={{ marginTop: 4, opacity: 0.75 }}>
              Изм. {fmtDateTime(item._updatedAt)}
            </Text>
          )}
        </Box>
      </Flex>
    </a>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  title, icon, count, color, children, emptyMessage,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  color?: string;
  children?: React.ReactNode;
  emptyMessage: string;
}) {
  return (
    <Card padding={4} radius={3} shadow={1} style={{ height: '100%' }}>
      <Flex align="center" justify="space-between" marginBottom={3}>
        <Flex align="center" gap={2}>
          <Box style={{ color: color || 'inherit' }}>{icon}</Box>
          <Text size={1} weight="bold">{title}</Text>
        </Flex>
        <Badge tone={count > 0 ? 'primary' : 'default'} fontSize={0} padding={2}>{count}</Badge>
      </Flex>
      {count === 0 ? (
        <Flex align="center" justify="center" style={{ padding: '24px 0' }}>
          <Text size={1} muted style={{ fontStyle: 'italic' }}>{emptyMessage}</Text>
        </Flex>
      ) : (
        children
      )}
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function PublicationScheduleTool() {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const windowStart = new Date();
      windowStart.setDate(windowStart.getDate() - TREND_DAYS);
      const result = await client.fetch<DashboardData>(QUERY, { windowStart: windowStart.toISOString() });
      setData(result);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('[PublicationScheduleTool] fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleDaySelect = useCallback((key: string, date: Date) => {
    setSelectedKey(prev => (prev === key ? null : key));
    setSelectedDate(prev => (prev && toDateKey(prev.toISOString()) === key ? null : date));
  }, []);

  const handleDayClose = useCallback(() => {
    setSelectedKey(null);
    setSelectedDate(null);
  }, []);

  const scheduledCount = data?.scheduled.length ?? 0;
  const recentCount = data?.recentTotal ?? 0;
  const draftsCount = data?.draftsTotal ?? 0;

  const scheduledGroups = data ? groupByDate(data.scheduled, 'publishedAt') : [];
  const recentGroups = data ? groupByDate(data.recent, 'publishedAt') : [];
  const dailyCounts = data ? buildDailyCounts(data.dailyPublishedDates, TREND_DAYS) : [];

  return (
    <Box padding={4} style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <Flex align="center" justify="space-between" marginBottom={4}>
        <Flex align="center" gap={3}>
          <CalendarIcon style={{ fontSize: 28, color: '#2276FC' }} />
          <Stack space={1}>
            <Heading size={2}>Расписание публикаций</Heading>
            <Text size={1} muted>
              {lastUpdated
                ? `Обновлено: ${String(lastUpdated.getHours()).padStart(2,'0')}:${String(lastUpdated.getMinutes()).padStart(2,'0')}`
                : 'Загрузка...'}
            </Text>
          </Stack>
        </Flex>
        <Flex align="center" gap={3}>
          <Flex gap={2} align="center">
            <Card padding={3} radius={2} tone="primary" style={{ textAlign: 'center', minWidth: 72 }}>
              <Text size={3} weight="bold" style={{ color: '#2276FC' }}>{scheduledCount}</Text>
              <Text size={0} muted>запланировано</Text>
            </Card>
            <Card padding={3} radius={2} tone="positive" style={{ textAlign: 'center', minWidth: 72 }}>
              <Text size={3} weight="bold" style={{ color: '#15803D' }}>{recentCount}</Text>
              <Text size={0} muted>опубликовано</Text>
            </Card>
            <Card padding={3} radius={2} tone="caution" style={{ textAlign: 'center', minWidth: 72 }}>
              <Text size={3} weight="bold" style={{ color: '#B45309' }}>{draftsCount}</Text>
              <Text size={0} muted>черновиков</Text>
            </Card>
          </Flex>
          <Button
            icon={loading ? Spinner : SyncIcon}
            text="Обновить"
            tone="default"
            mode="ghost"
            onClick={refresh}
            disabled={loading}
          />
        </Flex>
      </Flex>

      {loading && !data && (
        <Flex align="center" justify="center" style={{ height: 200 }}>
          <Spinner muted />
        </Flex>
      )}

      {data && (
        <Stack space={4}>
          {/* Interactive calendar strip */}
          <Card padding={4} radius={3} shadow={1}>
            <Flex align="center" gap={2} marginBottom={3}>
              <Text size={1} weight="bold">
                {selectedKey ? 'Выберите день' : 'Нажмите на день чтобы просмотреть расписание'}
              </Text>
              {selectedKey && (
                <Button
                  text="Все дни"
                  mode="ghost"
                  tone="default"
                  fontSize={1}
                  padding={2}
                  onClick={handleDayClose}
                />
              )}
            </Flex>
            <DayStrip
              scheduled={data.scheduled}
              recent={data.recent}
              selectedKey={selectedKey}
              onSelect={handleDaySelect}
            />
          </Card>

          {/* Day detail panel (when a day is selected) */}
          {selectedKey && selectedDate && (
            <DayPanel
              date={selectedDate}
              scheduled={data.scheduled}
              recent={data.recent}
              onClose={handleDayClose}
            />
          )}

          {/* Daily publication trend + top liked, side by side in one compact panel */}
          <ActivityPanel trend={dailyCounts} liked={data.topLiked} />

          {/* Main columns (always visible) */}
          <Flex gap={4} align="flex-start" style={{ flexWrap: 'wrap' }}>
            {/* Scheduled */}
            <Box style={{ flex: '1 1 340px', minWidth: 280 }}>
              <Section
                title="Запланировано"
                icon={<ClockIcon />}
                count={scheduledCount}
                color="#2276FC"
                emptyMessage="Нет запланированных публикаций"
              >
                {scheduledGroups.map(group => (
                  <Box key={group.label} marginBottom={3}>
                    <Flex align="center" gap={2} marginBottom={2}>
                      <Box style={{ height: 1, flex: 1, background: 'var(--card-border-color)' }} />
                      <Text size={0} weight="semibold" style={{ color: '#2276FC', whiteSpace: 'nowrap' }}>
                        {group.label}
                      </Text>
                      <Box style={{ height: 1, flex: 1, background: 'var(--card-border-color)' }} />
                    </Flex>
                    {group.items.map(item => <ItemRow key={item._id} item={item} />)}
                  </Box>
                ))}
              </Section>
            </Box>

            {/* Drafts */}
            <Box style={{ flex: '1 1 280px', minWidth: 240 }}>
              <Section
                title="Черновики"
                icon={<EditIcon />}
                count={draftsCount}
                color="#B45309"
                emptyMessage="Нет черновиков"
              >
                {data.drafts.map(item => <ItemRow key={item._id} item={item} />)}
              </Section>
            </Box>
          </Flex>

          {/* Recently published */}
          <Card padding={4} radius={3} shadow={1}>
            <Flex align="center" justify="space-between" marginBottom={3}>
              <Flex align="center" gap={2}>
                <Text size={1} weight="bold">Недавно опубликовано</Text>
                <Badge tone="positive" fontSize={0} padding={2}>{recentCount}</Badge>
              </Flex>
            </Flex>

            {recentCount === 0 ? (
              <Text size={1} muted style={{ fontStyle: 'italic' }}>Нет опубликованных материалов</Text>
            ) : (
              <Box>
                {recentGroups.slice(0, 10).map(group => (
                  <Box key={group.label} marginBottom={3}>
                    <Flex align="center" gap={2} marginBottom={2}>
                      <Text size={0} weight="semibold" muted style={{ whiteSpace: 'nowrap' }}>
                        {group.label}
                      </Text>
                      <Box style={{ height: 1, flex: 1, background: 'var(--card-border-color)' }} />
                    </Flex>
                    <Flex gap={2} style={{ flexWrap: 'wrap' }}>
                      {group.items.map(item => (
                        <a
                          key={item._id}
                          href={docHref(item)}
                          style={{ textDecoration: 'none', flex: '1 1 260px', minWidth: 220 }}
                        >
                          <Flex
                            gap={2}
                            align="flex-start"
                            style={{
                              padding: '10px 12px',
                              borderRadius: 8,
                              borderLeft: `3px solid ${item._type === 'article' ? '#1469F7' : '#E85D04'}`,
                              background: 'var(--card-bg-color)',
                              cursor: 'pointer',
                              height: '100%',
                            }}
                          >
                            <Flex gap={1} style={{ flexShrink: 0, paddingTop: 2 }}>
                              <Badge tone={item._type === 'article' ? 'primary' : 'caution'} fontSize={0} padding={1}>
                                {item._type === 'article' ? 'Ст' : 'Нв'}
                              </Badge>
                              <Badge tone={item.language === 'ru' ? 'positive' : 'default'} fontSize={0} padding={1}>
                                {item.language.toUpperCase()}
                              </Badge>
                            </Flex>
                            <Box style={{ minWidth: 0 }}>
                              <Text size={1} style={{ lineHeight: 1.4 }}>
                                {truncate(item.title || '(без названия)', 70)}
                              </Text>
                              {item.publishedAt && (
                                <Text size={1} style={{ marginTop: 4, opacity: 0.7 }}>
                                  {fmtDateTime(item.publishedAt)}
                                </Text>
                              )}
                            </Box>
                          </Flex>
                        </a>
                      ))}
                    </Flex>
                  </Box>
                ))}
                {recentGroups.length > 10 && (
                  <Text size={0} muted>
                    + ещё {recentGroups.slice(10).reduce((s, g) => s + g.items.length, 0)} публикаций...
                  </Text>
                )}
              </Box>
            )}
          </Card>
        </Stack>
      )}
    </Box>
  );
}
