import { Tags } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.og-meta-generator.title')),
  path: '/og-meta-generator',
  key: 'og-meta-generator',
  description: computed(() => translate('tools.og-meta-generator.description')),
  keywords: computed(() => translate('tools.og-meta-generator.keywords')),
  component: () => import('./og-meta-generator.vue'),
  icon: Tags,
})
