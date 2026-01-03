import { DeviceDesktop } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.device-information.title')),
  path: '/device-information',
  key: 'device-information',
  description: computed(() => translate('tools.device-information.description')),
  keywords: computed(() => translate('tools.device-information.keywords')),
  component: () => import('./device-information.vue'),
  icon: DeviceDesktop,
})
