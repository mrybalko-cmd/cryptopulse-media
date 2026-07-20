import { useClient } from 'sanity';
import imageUrlBuilder from '@sanity/image-url';
import { Box, Stack, Text } from '@sanity/ui';

interface Props {
  document?: { displayed?: Record<string, any> | null };
}

// Live mockup of how the banner will look under the "Популярное" block on
// the site — reachable as its own tab next to the editor form, so a campaign
// can be checked visually before Active is ever switched on. Reproduces the
// real component's look (square slot, "Реклама" label, dark card) with
// inline styles since Studio doesn't load the site's Tailwind build.
export function BannerPreview({ document }: Props) {
  const client = useClient({ apiVersion: '2024-01-01' });
  const doc = document?.displayed;

  const imageUrl = doc?.image
    ? imageUrlBuilder(client).image(doc.image).width(600).height(600).fit('crop').url()
    : null;
  const altText = doc?.altText || '';
  const language = doc?.language || 'all';
  const languageLabel = language === 'all' ? 'RU + EN' : language.toUpperCase();

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Text size={1} muted>
          Так баннер будет выглядеть на сайте под блоком «Популярное» — обновляется по мере заполнения полей, ещё до включения Active.
        </Text>

        <div
          style={{
            width: 256,
            background: '#16181d',
            border: '1px solid #2a2d36',
            borderRadius: 8,
            padding: 16,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#f4f4f5', fontWeight: 700, fontSize: 14 }}>
            <span>🔥</span> Популярное
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <span style={{ color: 'rgba(56,189,248,0.3)', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{i}</span>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ height: 7, width: '90%', background: '#2a2d36', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 7, width: '50%', background: '#2a2d36', borderRadius: 4 }} />
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: 16,
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid #2a2d36',
              background: '#1c1f26',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                zIndex: 1,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(22,24,29,0.8)',
                fontSize: 9,
                fontWeight: 500,
                color: '#9ca3af',
              }}
            >
              Реклама
            </span>
            {imageUrl ? (
              <img src={imageUrl} alt={altText} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 11, textAlign: 'center', padding: 12 }}>
                Загрузите картинку, чтобы увидеть превью
              </div>
            )}
          </div>
        </div>

        <Stack space={2}>
          <Text size={1}>
            Язык показа: <b>{languageLabel}</b>
          </Text>
          {!doc?.link && (
            <Text size={1} style={{ color: '#f59e0b' }}>
              ⚠️ Ссылка ещё не заполнена
            </Text>
          )}
          {!doc?.altText && (
            <Text size={1} style={{ color: '#f59e0b' }}>
              ⚠️ Alt-текст ещё не заполнен
            </Text>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
