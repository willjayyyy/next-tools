import { Qrcode } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.qrcode-generator.title')),
  path: '/qrcode-generator',
  key: 'qrcode-generator',
  description: computed(() => translate('tools.qrcode-generator.description')),
  keywords: computed(() => translate('tools.qrcode-generator.keywords')),
  component: () => import('./qrcode-generator.vue'),
  icon: Qrcode,
})
