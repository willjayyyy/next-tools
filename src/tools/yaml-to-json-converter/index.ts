import { AlignJustified } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.yaml-to-json-converter.title')),
  path: '/yaml-to-json-converter',
  key: 'yaml-to-json-converter',
  description: computed(() => translate('tools.yaml-to-json-converter.description')),
  keywords: computed(() => translate('tools.yaml-to-json-converter.keywords')),
  component: () => import('./yaml-to-json-converter.vue'),
  icon: AlignJustified,
  createdAt: new Date('2023-04-10'),
})
