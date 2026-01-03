import { FileInvoice } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.chmod-calculator.title')),
  path: '/chmod-calculator',
  key: 'chmod-calculator',
  description: computed(() => translate('tools.chmod-calculator.description')),
  keywords: computed(() => translate('tools.chmod-calculator.keywords')),
  component: () => import('./chmod-calculator.vue'),
  icon: FileInvoice,
})
