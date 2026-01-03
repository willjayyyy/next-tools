import { Phone } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.phone-parser-and-formatter.title')),
  path: '/phone-parser-and-formatter',
  key: 'phone-parser-and-formatter',
  description: computed(() => translate('tools.phone-parser-and-formatter.description')),
  keywords: computed(() => translate('tools.phone-parser-and-formatter.keywords')),
  component: () => import('./phone-parser-and-formatter.vue'),
  icon: Phone,
  createdAt: new Date('2023-05-01'),
})
