import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { CalendarIcon, HomeIcon } from '@sanity/icons';
import { schemaTypes } from './schemaTypes';
import { publishWithTimingAction } from './actions/publishWithTiming';
import { PublicationScheduleTool } from './plugins/PublicationScheduleTool';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const HOME_SETTINGS_ID = 'homeSettings';

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
            ...S.documentTypeListItems().filter((item) => item.getId() !== 'homeSettings'),
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
