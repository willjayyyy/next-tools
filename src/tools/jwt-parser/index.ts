import { Key } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.jwt-parser.title')),
  path: '/jwt-parser',
  key: 'jwt-parser',
  description: computed(() => translate('tools.jwt-parser.description')),
  keywords: computed(() => translate('tools.jwt-parser.keywords')),
  component: () => import('./jwt-parser.vue'),
  icon: Key,
})
