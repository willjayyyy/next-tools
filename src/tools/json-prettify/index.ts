import { Braces } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.json-prettify.title')),
  path: '/json-prettify',
  key: 'json-prettify',
  description: computed(() => translate('tools.json-prettify.description')),
  keywords: computed(() => translate('tools.json-prettify.keywords')),
  component: () => import('./json-prettify.vue'),
  icon: Braces,
  redirectFrom: ['/json-viewer'],
})
