import { useEffect, useState, useCallback } from 'react';
import { useClient } from 'sanity';
import {
  Box, Card, Flex, Stack, Text, Badge, Spinner, Button, Heading,
} from '@sanity/ui';
import { CalendarIcon, SyncIcon, EditIcon, ClockIcon } from '@sanity/icons';

type Item = {
  _id: string;
  _type: 'news' | 'article';
  title: string;
  language: 'ru' | 'en';
  publishedAt?: string;
  _updatedAt?: string;
};

type DashboardData = {
  scheduled: Item[];
  recent: Item[];
  drafts: Item[];
};

const QUERY = `{
  "scheduled": *[_type in ["news", "article"] && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt > now()] | order(publishedAt asc) {
    _id, _type, title, language, publishedAt
  },
  "recent": *[_type in ["news", "article"] && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [0...30] {
    _id, _type, title, language, publishedAt
  },
  "drafts": *[_type in ["news", "article"] && _id in path("drafts.**")] | order(_updatedAt desc) [0...15] {
    _id, _type, title, language, _updatedAt
  }
}`;

const RU_MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
const RU_WEEKDAYS = ['вс','пн','вт','ср','чт','пт','сб'];

function toDateKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
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

function WeekStrip({ scheduled }: { scheduled: Item[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countByKey = new Map<string, number>();
  scheduled.forEach(item => {
    if (!item.publishedAt) return;
    countByKey.set(toDateKey(item.publishedAt), (countByKey.get(toDateKey(item.publishedAt)) || 0) + 1);
  });

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <Flex gap={1} style={{ overflowX: 'auto', paddingBottom: 4 }}>
      {days.map((date, i) => {
        const k = toDateKey(date.toISOString());
        const count = countByKey.get(k) || 0;
        const isToday = i === 0;

        return (
          <Stack
            key={k}
            space={1}
            style={{
              flex: '1 0 42px',
              textAlign: 'center',
              padding: '8px 4px 6px',
              borderRadius: 8,
              background: isToday
                ? 'var(--card-focus-ring-color, rgba(34,118,252,0.08))'
                : count > 0
                ? 'rgba(34,118,252,0.04)'
                : 'transparent',
              border: isToday
                ? '1px solid rgba(34,118,252,0.25)'
                : '1px solid transparent',
            }}
          >
            <Text size={0} muted style={{ textTransform: 'capitalize', display: 'block', lineHeight: 1.2 }}>
              {RU_WEEKDAYS[date.getDay()]}
            </Text>
            <Text
              size={1}
              weight={isToday ? 'bold' : 'regular'}
              style={{ display: 'block', lineHeight: 1.5, color: isToday ? '#2276FC' : 'inherit' }}
            >
              {date.getDate()}
            </Text>
            <Flex justify="center" align="center" style={{ height: 16 }}>
              {count > 0 ? (
                <Box
                  style={{
                    width: Math.min(count, 3) * 5 + 4,
                    height: 7,
                    borderRadius: 4,
                    background: '#2276FC',
                    fontSize: 9,
                    color: '#fff',
                    lineHeight: '7px',
                    textAlign: 'center',
                    fontWeight: 700,
                  }}
                >
                  {count > 1 ? count : ''}
                </Box>
              ) : null}
            </Flex>
          </Stack>
        );
      })}
    </Flex>
  );
}

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
          <Text
            size={1}
            weight="semibold"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
              lineHeight: 1.45,
            }}
          >
            {item.title || '(без названия)'}
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

function Section({
  title,
  icon,
  count,
  color,
  children,
  emptyMessage,
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
        <Badge
          tone={count > 0 ? 'primary' : 'default'}
          fontSize={0}
          padding={2}
        >
          {count}
        </Badge>
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

export function PublicationScheduleTool() {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await client.fetch<DashboardData>(QUERY);
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

  // Stats
  const scheduledCount = data?.scheduled.length ?? 0;
  const recentCount = data?.recent.length ?? 0;
  const draftsCount = data?.drafts.length ?? 0;

  // Grouped scheduled
  const scheduledGroups = data ? groupByDate(data.scheduled, 'publishedAt') : [];
  // Grouped recent (last 7 days only for compact view, rest collapsed)
  const recentGroups = data ? groupByDate(data.recent, 'publishedAt') : [];

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
          {/* Stats */}
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
          {/* 14-day calendar strip */}
          <Card padding={4} radius={3} shadow={1}>
            <Flex align="center" gap={2} marginBottom={3}>
              <Text size={1} weight="bold">Следующие 14 дней</Text>
              {scheduledCount === 0 && (
                <Text size={1} muted>— нет запланированных публикаций</Text>
              )}
            </Flex>
            <WeekStrip scheduled={data.scheduled} />
          </Card>

          {/* Main columns */}
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
                      <Box
                        style={{
                          height: 1,
                          flex: 1,
                          background: 'var(--card-border-color)',
                        }}
                      />
                      <Text size={0} weight="semibold" style={{ color: '#2276FC', whiteSpace: 'nowrap' }}>
                        {group.label}
                      </Text>
                      <Box
                        style={{
                          height: 1,
                          flex: 1,
                          background: 'var(--card-border-color)',
                        }}
                      />
                    </Flex>
                    {group.items.map(item => (
                      <ItemRow key={item._id} item={item} />
                    ))}
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
                {data.drafts.map(item => (
                  <ItemRow key={item._id} item={item} />
                ))}
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
                              <Badge
                                tone={item._type === 'article' ? 'primary' : 'caution'}
                                fontSize={0}
                                padding={1}
                              >
                                {item._type === 'article' ? 'Ст' : 'Нв'}
                              </Badge>
                              <Badge
                                tone={item.language === 'ru' ? 'positive' : 'default'}
                                fontSize={0}
                                padding={1}
                              >
                                {item.language.toUpperCase()}
                              </Badge>
                            </Flex>
                            <Box style={{ minWidth: 0 }}>
                              <Text
                                size={1}
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical' as const,
                                  overflow: 'hidden',
                                  lineHeight: 1.4,
                                }}
                              >
                                {item.title || '(без названия)'}
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
