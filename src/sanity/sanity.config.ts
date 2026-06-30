import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { publishWithTimingAction } from './actions/publishWithTiming';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'cryptopulse',
  title: 'CryptoPulse.media',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
  basePath: '/studio',
  document: {
    actions: (prev, context) =>
      context.schemaType === 'article' || context.schemaType === 'news'
        ? prev.map(action => (action.action === 'publish' ? publishWithTimingAction : action))
        : prev,
  },
});
