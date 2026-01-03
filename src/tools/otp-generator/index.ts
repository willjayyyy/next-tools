import { DeviceMobile } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.otp-generator.title')),
  path: '/otp-generator',
  key: 'otp-generator',
  description: computed(() => translate('tools.otp-generator.description')),
  keywords: computed(() => translate('tools.otp-generator.keywords')),
  component: () => import('./otp-generator.vue'),
  icon: DeviceMobile,
})
