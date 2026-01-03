import { ArrowsLeftRight } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.base-converter.title')),
  path: '/base-converter',
  key: 'base-converter',
  description: computed(() => translate('tools.base-converter.description')),
  keywords: computed(() => translate('tools.base-converter.keywords')),
  component: () => import('./integer-base-converter.vue'),
  icon: ArrowsLeftRight,
})
