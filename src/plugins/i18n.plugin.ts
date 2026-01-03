import type { Plugin } from 'vue'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { get } from '@vueuse/core'
import { createI18n, type I18n } from 'vue-i18n';

const i18n: I18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missing: () => '',
  fallbackWarn: false,
  messages,
});

// 缓存已加载的工具翻译
const loadedToolMessages = new Set<string>();

/**
 * 动态加载工具翻译
 * @param toolPath 工具路径，例如 '/chronometer'
 * @param locale 语言代码，例如 'en', 'zh'
 */
export async function loadToolMessages(toolPath: string, locale: string = 'en') {
  const toolName = toolPath.replace(/^\//, ''); // 移除前导斜杠
  const cacheKey = `${toolName}-${locale}`;

  // 如果已经加载过，直接返回
  if (loadedToolMessages.has(cacheKey)) {
    return;
  }

  try {

    const content = await import(`@/tools/${toolName}/locales/${locale}.json`).catch((e) => {
      console.error(e);
      return null;
    })

    if (content?.default) {
      const toolMessages = content.default;

      // 使用 vue-i18n 的 mergeLocaleMessage 方法合并翻译
      i18n.global.mergeLocaleMessage(locale, toolMessages as any);
      loadedToolMessages.add(cacheKey);
    }
  }
  catch (error) {
    // 翻译文件不存在时静默失败
    console.warn(`Translation file not found for tool: ${toolName}, locale: ${locale}`, error);
  }
}

export const i18nPlugin: Plugin = {
  install: (app) => {
    app.use(i18n);
  },
};

export const translate = function (localeKey: string) {
  const hasKey = i18n.global.te(localeKey, get(i18n.global.locale));
  return hasKey ? (i18n.global.t as any)(localeKey) : localeKey;
}

export { i18n };
