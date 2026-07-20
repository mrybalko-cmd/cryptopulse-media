import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { CalendarIcon, HomeIcon } from '@sanity/icons';
import { schemaTypes } from './schemaTypes';
import { publishWithTimingAction } from './actions/publishWithTiming';
import { PublicationScheduleTool } from './plugins/PublicationScheduleTool';
import { BannerPreview } from './components/BannerPreview';

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
            ...S.documentTypeListItems()
              .filter((item) => item.getId() !== 'homeSettings')
              .map((item) => {
                if (item.getId() !== 'sidebarBanner') return item;
                // Gives sidebarBanner its own "Превью на сайте" tab next to
                // the editor form — a live mockup of the banner in its real
                // slot, so a campaign can be checked visually before Active
                // is ever switched on. Every other type keeps the default
                // single-view document editor.
                return S.listItem()
                  .title(item.getTitle() ?? 'Sidebar Banner')
                  .icon(item.getIcon())
                  .child(
                    S.documentTypeList('sidebarBanner')
                      .title('Sidebar Banner')
                      .child((documentId) =>
                        S.document()
                          .documentId(documentId)
                          .schemaType('sidebarBanner')
                          .views([
                            S.view.form(),
                            S.view.component(BannerPreview).id('preview').title('Превью на сайте'),
                          ])
                      )
                  );
              }),
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
