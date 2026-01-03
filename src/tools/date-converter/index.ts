import { Calendar } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.date-converter.title')),
  path: '/date-converter',
  key: 'date-converter',
  description: computed(() => translate('tools.date-converter.description')),
  keywords: computed(() => translate('tools.date-converter.keywords')),
  component: () => import('./date-time-converter.vue'),
  icon: Calendar,
})
