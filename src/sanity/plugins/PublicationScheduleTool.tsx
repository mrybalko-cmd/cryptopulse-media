import { useEffect, useState, useCallback } from 'react';
import { useClient } from 'sanity';
import {
  Box, Card, Flex, Stack, Text, Badge, Spinner, Button, Heading,
} from '@sanity/ui';
import {
  CalendarIcon, SyncIcon, EditIcon, ClockIcon, CheckmarkIcon, CloseIcon,
  ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, UsersIcon,
} from '@sanity/icons';

type Item = {
  _id: string;
  _type: 'news' | 'article';
  title: string;
  language: 'ru' | 'en';
  publishedAt?: string;
  _updatedAt?: string;
};

type LikedItem = Item & { likes: number; views: number };

type AuthorCount = { name?: string };

type DashboardData = {
  scheduled: Item[];
  recent: Item[];
  recentWindowTotal: number;
  drafts: Item[];
  recentTotal: number;
  draftsTotal: number;
  dailyPublishedDates: string[];
  topLiked: LikedItem[];
  byAuthor: AuthorCount[];
};

const TREND_DAYS = 30;
// "Recently published" used to just show the last 60 items regardless of
// date, while the header badge showed the true lifetime total — at this
// site's publishing volume those two numbers could differ by hundreds,
// making the badge look wrong. Bounding "recent" to an actual date window
// means its own count always equals exactly what's listed below it.
const RECENT_WINDOW_DAYS = 7;
// "Recently published" is the longest section and sits last on the page —
// only render the most recent N here by default instead of the whole
// 7-day window, and let the card collapse entirely since it's rarely the
// first thing worth looking at.
const RECENT_LIST_LIMIT = 10;
// How many days the calendar strip's forward/back buttons jump per click.
const STRIP_STEP_DAYS = 15;

type TypeFilter = 'all' | 'article' | 'news';
type LangFilter = 'all' | 'ru' | 'en';

// "$types"/"$langs" are always passed as arrays (["article","news"] for
// "all") so every sub-query below can use a plain "in" check instead of
// branching GROQ on whether a filter is active — one shape, always filtered.
const QUERY = `{
  "scheduled": *[_type in $types && language in $langs && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt > now()] | order(publishedAt asc) {
    _id, _type, title, language, publishedAt
  },
  "recent": *[_type in $types && language in $langs && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now() && publishedAt >= $recentWindowStart] | order(publishedAt desc) {
    _id, _type, title, language, publishedAt
  },
  "recentWindowTotal": count(*[_type in $types && language in $langs && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now() && publishedAt >= $recentWindowStart]),
  "recentTotal": count(*[_type in $types && language in $langs && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now()]),
  "drafts": *[_type in $types && language in $langs && _id in path("drafts.**")] | order(_updatedAt desc) [0...15] {
    _id, _type, title, language, _updatedAt
  },
  "draftsTotal": count(*[_type in $types && language in $langs && _id in path("drafts.**")]),
  "dailyPublishedDates": *[_type in $types && language in $langs && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now() && publishedAt >= $trendWindowStart].publishedAt,
  "topLiked": *[_type in $types && language in $langs && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now() && coalesce(likes, 0) > 0] | order(likes desc) [0...10] {
    _id, _type, title, language, publishedAt, "likes": coalesce(likes, 0), "views": coalesce(views, 0)
  },
  "byAuthor": *[_type in $types && language in $langs && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now() && defined(author)] {
    "name": author->name
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

function fmtShortDate(d: Date) {
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]}`;
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

function buildAuthorCounts(byAuthor: AuthorCount[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  byAuthor.forEach(({ name }) => {
    const key = name || 'Без автора';
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
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

// ── Filter bar ──────────────────────────────────────────────────────────────

function ToggleGroup<T extends string>({
  value, onChange, options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <Flex gap={1}>
      {options.map(opt => (
        <Button
          key={opt.value}
          text={opt.label}
          fontSize={1}
          padding={2}
          mode={value === opt.value ? 'default' : 'ghost'}
          tone={value === opt.value ? 'primary' : 'default'}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </Flex>
  );
}

function FilterBar({
  typeFilter, onTypeChange, langFilter, onLangChange,
}: {
  typeFilter: TypeFilter;
  onTypeChange: (v: TypeFilter) => void;
  langFilter: LangFilter;
  onLangChange: (v: LangFilter) => void;
}) {
  return (
    <Card padding={3} radius={3} shadow={1}>
      <Flex gap={4} align="center" style={{ flexWrap: 'wrap' }}>
        <Flex gap={2} align="center">
          <Text size={1} muted style={{ whiteSpace: 'nowrap' }}>Тип:</Text>
          <ToggleGroup
            value={typeFilter}
            onChange={onTypeChange}
            options={[
              { value: 'all', label: 'Все' },
              { value: 'article', label: 'Статьи' },
              { value: 'news', label: 'Новости' },
            ]}
          />
        </Flex>
        <Flex gap={2} align="center">
          <Text size={1} muted style={{ whiteSpace: 'nowrap' }}>Язык:</Text>
          <ToggleGroup
            value={langFilter}
            onChange={onLangChange}
            options={[
              { value: 'all', label: 'Все' },
              { value: 'ru', label: 'RU' },
              { value: 'en', label: 'EN' },
            ]}
          />
        </Flex>
      </Flex>
    </Card>
  );
}

// ── Activity panel: daily trend + top liked + by author, side by side ───────

function ActivityPanel({
  trend, liked, authors,
}: {
  trend: DayCount[];
  liked: LikedItem[];
  authors: { name: string; count: number }[];
}) {
  const max = Math.max(1, ...trend.map(d => d.count));
  const total = trend.reduce((s, d) => s + d.count, 0);
  const avg = trend.length ? (total / trend.length).toFixed(1) : '0';
  const todayKey = toDateKey(new Date().toISOString());
  const maxAuthorCount = Math.max(1, ...authors.map(a => a.count));

  return (
    <Card padding={4} radius={3} shadow={1}>
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {/* Daily trend chart */}
        <Box style={{ flex: '2 1 340px', minWidth: 0 }}>
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

        <Box style={{ width: 1, background: 'var(--card-border-color)', alignSelf: 'stretch' }} />

        {/* Top liked — all-time, not bounded by the trend window above, so
            labeled explicitly to avoid reading it as "top of the last 30 days" */}
        <Box style={{ flex: '1 1 240px', minWidth: 220 }}>
          <Flex align="center" gap={2} marginBottom={3}>
            <Box style={{ color: '#DC2626' }}>❤</Box>
            <Text size={1} weight="bold">Топ по лайкам</Text>
            <Text size={0} muted>· за всё время</Text>
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

        <Box style={{ width: 1, background: 'var(--card-border-color)', alignSelf: 'stretch' }} />

        {/* By author — lifetime published count per author, for the current filter */}
        <Box style={{ flex: '1 1 240px', minWidth: 220 }}>
          <Flex align="center" gap={2} marginBottom={3}>
            <Box style={{ color: '#7C3AED' }}><UsersIcon /></Box>
            <Text size={1} weight="bold">По авторам</Text>
          </Flex>
          {authors.length > 0 ? (
            <Stack space={2} style={{ maxHeight: 172, overflowY: 'auto' }}>
              {authors.slice(0, 8).map(({ name, count }) => (
                <Box key={name}>
                  <Flex align="center" justify="space-between" marginBottom={1}>
                    <Text size={1} style={{ lineHeight: 1.3 }}>{truncate(name, 26)}</Text>
                    <Text size={1} weight="semibold" muted>{count}</Text>
                  </Flex>
                  <Box style={{ height: 4, borderRadius: 2, background: 'var(--card-border-color)', overflow: 'hidden' }}>
                    <Box style={{ height: '100%', width: `${(count / maxAuthorCount) * 100}%`, background: '#7C3AED', borderRadius: 2 }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <Text size={1} muted>Нет данных по авторам</Text>
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
  anchor,
  onPrev,
  onNext,
  onToday,
  isShifted,
}: {
  scheduled: Item[];
  recent: Item[];
  selectedKey: string | null;
  onSelect: (key: string, date: Date) => void;
  anchor: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isShifted: boolean;
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
    const d = new Date(anchor);
    d.setDate(anchor.getDate() + i);
    return d;
  });

  // Past days: show the 7 days before the anchor too, same as before —
  // just relative to the (possibly paged) anchor instead of always "today".
  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() - (7 - i));
    return d;
  });

  const allDays = [...pastDays, ...days];

  return (
    <Box>
      <Flex align="center" justify="space-between" marginBottom={2} style={{ flexWrap: 'wrap', gap: 8 }}>
        <Text size={0} muted>
          {fmtShortDate(allDays[0])} – {fmtShortDate(allDays[allDays.length - 1])}
        </Text>
        <Flex gap={1} align="center">
          {isShifted && (
            <Button text="Сегодня" mode="ghost" tone="primary" fontSize={1} padding={2} onClick={onToday} />
          )}
          <Button icon={ChevronLeftIcon} mode="ghost" tone="default" padding={2} onClick={onPrev} title="Раньше" />
          <Button icon={ChevronRightIcon} mode="ghost" tone="default" padding={2} onClick={onNext} title="Позже" />
        </Flex>
      </Flex>
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
      </Box>
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
  title, icon, count, color, children, emptyMessage, maxHeight,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  color?: string;
  children?: React.ReactNode;
  emptyMessage: string;
  // Scrollable cap so a large backlog (e.g. many scheduled items) doesn't
  // stretch the whole page — matches the treatment "Топ по лайкам" already had.
  maxHeight?: number;
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
      ) : maxHeight ? (
        <Box style={{ maxHeight, overflowY: 'auto' }}>{children}</Box>
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
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [langFilter, setLangFilter] = useState<LangFilter>('all');
  const [stripOffsetDays, setStripOffsetDays] = useState(0);
  const [recentExpanded, setRecentExpanded] = useState(false);

  const types = typeFilter === 'all' ? ['article', 'news'] : [typeFilter];
  const langs = langFilter === 'all' ? ['ru', 'en'] : [langFilter];

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const trendWindowStart = new Date();
      trendWindowStart.setDate(trendWindowStart.getDate() - TREND_DAYS);
      const recentWindowStart = new Date();
      recentWindowStart.setDate(recentWindowStart.getDate() - RECENT_WINDOW_DAYS);
      const result = await client.fetch<DashboardData>(QUERY, {
        types,
        langs,
        trendWindowStart: trendWindowStart.toISOString(),
        recentWindowStart: recentWindowStart.toISOString(),
      });
      setData(result);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('[PublicationScheduleTool] fetch error:', e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, typeFilter, langFilter]);

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

  const shiftStrip = useCallback((deltaDays: number) => {
    setStripOffsetDays(v => v + deltaDays);
    handleDayClose();
  }, [handleDayClose]);

  const resetStrip = useCallback(() => {
    setStripOffsetDays(0);
    handleDayClose();
  }, [handleDayClose]);

  const scheduledCount = data?.scheduled.length ?? 0;
  const recentTotal = data?.recentTotal ?? 0;
  const recentWindowCount = data?.recent.length ?? 0;
  const draftsCount = data?.draftsTotal ?? 0;

  const scheduledGroups = data ? groupByDate(data.scheduled, 'publishedAt') : [];
  const recentGroups = data ? groupByDate(data.recent.slice(0, RECENT_LIST_LIMIT), 'publishedAt') : [];
  const dailyCounts = data ? buildDailyCounts(data.dailyPublishedDates, TREND_DAYS) : [];
  const authorCounts = data ? buildAuthorCounts(data.byAuthor) : [];

  const stripAnchor = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + stripOffsetDays);
    return d;
  })();

  return (
    <Box padding={4} style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <Flex align="center" justify="space-between" marginBottom={4} style={{ flexWrap: 'wrap', gap: 12 }}>
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
              <Text size={3} weight="bold" style={{ color: '#15803D' }}>{recentTotal}</Text>
              <Text size={0} muted>опубликовано всего</Text>
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

      <Box marginBottom={4}>
        <FilterBar
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          langFilter={langFilter}
          onLangChange={setLangFilter}
        />
      </Box>

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
              anchor={stripAnchor}
              onPrev={() => shiftStrip(-STRIP_STEP_DAYS)}
              onNext={() => shiftStrip(STRIP_STEP_DAYS)}
              onToday={resetStrip}
              isShifted={stripOffsetDays !== 0}
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

          {/* Daily publication trend + top liked + by author, side by side */}
          <ActivityPanel trend={dailyCounts} liked={data.topLiked} authors={authorCounts} />

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
                maxHeight={480}
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
                maxHeight={480}
              >
                {data.drafts.map(item => <ItemRow key={item._id} item={item} />)}
                {draftsCount > data.drafts.length && (
                  <Text size={0} muted>
                    + ещё {draftsCount - data.drafts.length} черновиков...
                  </Text>
                )}
              </Section>
            </Box>
          </Flex>

          {/* Recently published — bounded to an actual window (see
              RECENT_WINDOW_DAYS), so the badge always equals exactly what's
              in that window, unlike before when the badge showed the
              lifetime total but the list below only covered a few days.
              Collapsed by default and capped to RECENT_LIST_LIMIT items —
              it's the longest section and sits last, so it shouldn't force
              a scroll through everything just to reach the bottom of the page. */}
          <Card padding={4} radius={3} shadow={1}>
            <Flex
              align="center"
              justify="space-between"
              onClick={() => setRecentExpanded(v => !v)}
              style={{ cursor: 'pointer' }}
            >
              <Flex align="center" gap={2}>
                <Text size={1} weight="bold">Недавно опубликовано</Text>
                <Text size={0} muted>· за последние {RECENT_WINDOW_DAYS} дн.</Text>
                <Badge tone="positive" fontSize={0} padding={2}>{recentWindowCount}</Badge>
              </Flex>
              <Button
                icon={recentExpanded ? ChevronUpIcon : ChevronDownIcon}
                mode="ghost"
                tone="default"
                padding={2}
                onClick={(e) => { e.stopPropagation(); setRecentExpanded(v => !v); }}
                title={recentExpanded ? 'Свернуть' : 'Развернуть'}
              />
            </Flex>

            {recentExpanded && (
            <Box marginTop={3}>
            {recentWindowCount === 0 ? (
              <Text size={1} muted style={{ fontStyle: 'italic' }}>Нет опубликованных материалов за этот период</Text>
            ) : (
              <Box>
                {recentWindowCount > RECENT_LIST_LIMIT && (
                  <Text size={0} muted style={{ display: 'block', marginBottom: 12 }}>
                    Показаны последние {RECENT_LIST_LIMIT} из {recentWindowCount}
                  </Text>
                )}
                {recentGroups.map(group => (
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
              </Box>
            )}
            </Box>
            )}
          </Card>
        </Stack>
      )}
    </Box>
  );
}
