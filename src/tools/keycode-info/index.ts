import { Keyboard } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.keycode-info.title')),
  path: '/keycode-info',
  key: 'keycode-info',
  description: computed(() => translate('tools.keycode-info.description')),
  keywords: computed(() => translate('tools.keycode-info.keywords')),
  component: () => import('./keycode-info.vue'),
  icon: Keyboard,
})
