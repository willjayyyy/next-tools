import { PasswordRound } from '@vicons/material';
import { translate } from '@/plugins/i18n.plugin'
import { defineTool } from '../tool'

export const tool = defineTool({
  key: 'basic-auth-generator',
  name: computed(() => translate('tools.basic-auth-generator.title')),
  path: '/basic-auth-generator',
  description: computed(() => translate('tools.basic-auth-generator.description')),
  keywords: computed(() => translate('tools.basic-auth-generator.keywords')),
  component: () => import('./basic-auth-generator.vue'),
  icon: PasswordRound,
});
