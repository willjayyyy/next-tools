import { Braces } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.json-to-yaml-converter.title')),
  path: '/json-to-yaml-converter',
  key: 'json-to-yaml-converter',
  description: computed(() => translate('tools.json-to-yaml-converter.description')),
  keywords: computed(() => translate('tools.json-to-yaml-converter.keywords')),
  component: () => import('./json-to-yaml-converter.vue'),
  icon: Braces,
  createdAt: new Date('2023-04-10'),
})
