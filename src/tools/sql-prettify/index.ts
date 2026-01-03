import { Database } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.sql-prettify.title')),
  path: '/sql-prettify',
  key: 'sql-prettify',
  description: computed(() => translate('tools.sql-prettify.description')),
  keywords: computed(() => translate('tools.sql-prettify.keywords')),
  component: () => import('./sql-prettify.vue'),
  icon: Database,
})
