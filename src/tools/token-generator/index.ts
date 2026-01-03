import { ArrowsShuffle } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.token-generator.title')),
  path: '/token-generator',
  key: 'token-generator',
  description: computed(() => translate('tools.token-generator.description')),
  keywords: computed(() => translate('tools.token-generator.keywords')),
  component: () => import('./token-generator.vue'),
  icon: ArrowsShuffle,
})
