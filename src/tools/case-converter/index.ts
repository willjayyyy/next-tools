import { LetterCaseToggle } from '@vicons/tabler';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.case-converter.title')),
  path: '/case-converter',
  key: 'case-converter',
  description: computed(() => translate('tools.case-converter.description')),
  keywords: computed(() => translate('tools.case-converter.keywords')),
  component: () => import('./case-converter.vue'),
  icon: LetterCaseToggle,
})
