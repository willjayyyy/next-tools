import { ScanLine } from 'lucide-vue-next';
import { computed } from 'vue';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: computed(() => translate('tools.barcode-scanner.title')),
  path: '/barcode-scanner',
  key: 'barcode-scanner',
  description: computed(() => translate('tools.barcode-scanner.description')),
  keywords: computed(() => translate('tools.barcode-scanner.keywords')),
  component: () => import('./barcode-scanner.vue'),
  icon: ScanLine,
  redirectFrom: ['/qr-code-reader', '/qrcode-reader'],
  createdAt: new Date('2026-06-02'),
})
