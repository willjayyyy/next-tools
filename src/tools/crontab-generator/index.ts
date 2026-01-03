import { Alarm } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.crontab-generator.title')),
  path: '/crontab-generator',
  key: 'crontab-generator',
  description: computed(() => translate('tools.crontab-generator.description')),
  keywords: computed(() => translate('tools.crontab-generator.keywords')),
  component: () => import('./crontab-generator.vue'),
  icon: Alarm,
})
