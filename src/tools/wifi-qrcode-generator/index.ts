import { Qrcode } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.wifi-qrcode-generator.title')),
  path: '/wifi-qrcode-generator',
  key: 'wifi-qrcode-generator',
  description: computed(() => translate('tools.wifi-qrcode-generator.description')),
  keywords: computed(() => translate('tools.wifi-qrcode-generator.keywords')),
  component: () => import('./wifi-qr-code-generator.vue'),
  icon: Qrcode,
  createdAt: new Date('2023-09-06'),
})
