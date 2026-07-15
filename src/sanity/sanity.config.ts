import { defineConfig } from 'sanity';
import { structureTool, type StructureBuilder } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { CalendarIcon, HomeIcon } from '@sanity/icons';
import { schemaTypes } from './schemaTypes';
import { publishWithTimingAction } from './actions/publishWithTiming';
import { PublicationScheduleTool } from './plugins/PublicationScheduleTool';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const HOME_SETTINGS_ID = 'homeSettings';

// Same live/soon/pending thresholds as publishStatusDot() — 1 hour window
// for "🟡 soon". Kept as GROQ date arithmetic (dateTime(now()) + 60*60)
// rather than a JS-computed param so the window is always relative to
// whenever the pane is actually opened, not when the config loaded.
// publishedAt is stored as a plain string, so it MUST be wrapped in
// dateTime(publishedAt) whenever it's compared against a value built from
// dateTime()/+ arithmetic — comparing the raw string against a typed
// dateTime value silently evaluates to null (not true/false), which
// filtered out every document instead of matching any of them.
function statusFilterItems(S: StructureBuilder, type: 'article' | 'news', title: string) {
  return S.listItem()
    .title(title)
    .child(
      S.list()
        .title(title)
        .items([
          S.listItem()
            .id(`${type}-all`)
            .title('Все')
            .child(S.documentTypeList(type).title(title)),
          S.listItem()
            .id(`${type}-live`)
            .title('🟢 На сайте')
            .child(
              S.documentList()
                .id(`${type}-live-list`)
                .title('🟢 На сайте')
                .schemaType(type)
                .filter('_type == $type && !(_id in path("drafts.**")) && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now())')
                .params({ type })
            ),
          S.listItem()
            .id(`${type}-soon`)
            .title('🟡 Скоро (в течение часа)')
            .child(
              S.documentList()
                .id(`${type}-soon-list`)
                .title('🟡 Скоро (в течение часа)')
                .schemaType(type)
                .filter('_type == $type && !(_id in path("drafts.**")) && defined(publishedAt) && dateTime(publishedAt) > dateTime(now()) && dateTime(publishedAt) <= dateTime(now()) + 60*60')
                .params({ type })
            ),
          S.listItem()
            .id(`${type}-pending`)
            .title('🔴 Черновик / запланировано')
            .child(
              S.documentList()
                .id(`${type}-pending-list`)
                .title('🔴 Черновик / запланировано')
                .schemaType(type)
                .filter('_type == $type && (_id in path("drafts.**") || !defined(publishedAt) || dateTime(publishedAt) > dateTime(now()) + 60*60)')
                .params({ type })
            ),
        ])
    );
}

export default defineConfig({
  name: 'cryptopulse',
  title: 'CryptoPulse.media',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Содержимое')
          .items([
            S.listItem()
              .title('Настройки главной / Homepage Settings')
              .icon(HomeIcon)
              .child(S.document().schemaType('homeSettings').documentId(HOME_SETTINGS_ID)),
            S.divider(),
            statusFilterItems(S, 'article', 'Article'),
            statusFilterItems(S, 'news', 'News'),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !['homeSettings', 'article', 'news'].includes(item.getId() as string)
            ),
          ]),
    }),
    visionTool(),
  ],
  tools: (prev) => [
    ...prev,
    {
      name: 'publication-schedule',
      title: 'Расписание',
      icon: CalendarIcon,
      component: PublicationScheduleTool,
    },
  ],
  schema: { types: schemaTypes },
  basePath: '/studio',
  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'article' || context.schemaType === 'news') {
        return prev.map(action => (action.action === 'publish' ? publishWithTimingAction : action));
      }
      // Singleton — no duplicate/delete, there's only ever one homeSettings doc.
      if (context.schemaType === 'homeSettings') {
        return prev.filter(action => action.action !== 'duplicate' && action.action !== 'delete');
      }
      return prev;
    },
  },
});
