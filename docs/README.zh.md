
<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="next-tools-logo-dark.png" />
  <img src="next-tools-logo-light.png" alt="Next-Tools Logo" width="500"/>
</picture>

**专为开发者和 IT 专业人士打造的实用在线工具集合**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub stars](https://img.shields.io/github/stars/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/issues)

**🗣️ 语言:** [English](../README.md) • 中文 • [Français](README.fr.md) • [Deutsch](README.de.md) • [Español](README.es.md) • [Português](README.pt.md) • [Русский](README.ru.md) • [Українська](README.uk.md) • [Norsk](README.no.md) • [Tiếng Việt](README.vi.md)

[🌐 在线试用！](https://next-tools.dev) •
[📖 关于项目](https://next-tools.dev/about) •
[🐛 报告问题](https://github.com/willjayyyy/next-tools/issues) •
[💡 功能请求](https://github.com/willjayyyy/next-tools/issues/new/choose)

</div>

---

> **注意：** 这是对原 [it-tools](https://github.com/CorentinTh/it-tools) 项目的分支和重构，由 [Will Jay](https://github.com/willjayyyy) 维护。本项目采用 GNU GPLv3 许可证。

## ✨ 特性

- 🔧 **120+ 开发者工具** - 从数据转换到网络分析
- 🎨 **现代化界面** - 基于 Vue.js 3 构建的简洁直观界面
- 🔒 **隐私优先** - 所有工具都在浏览器本地运行
- 🌍 **10 种语言** - 完整的国际化支持
- 📱 **响应式设计** - 在所有设备上完美运行
- ⚡ **快速轻量** - 使用 Vite 构建，性能优化
- 🆓 **免费开源** - GPL-3.0 许可证，永远免费

## 🚀 快速开始

### 在线使用
访问 [next-tools.dev](https://next-tools.dev) 直接在浏览器中使用所有工具。

### 自托管部署

#### 使用 Docker Hub：
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  willjayyyy/next-tools:latest
```

#### 使用 GitHub Packages：
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  ghcr.io/willjayyyy/next-tools:latest
```

#### 本地开发：
```bash
# 克隆仓库
git clone https://github.com/willjayyyy/next-tools.git
cd next-tools

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 🛠️ 工具分类

- **转换器** - JSON、XML、YAML、CSV、Base64、URL 编码
- **生成器** - UUID、密码、QR 码、哈希、JWT
- **格式化器** - SQL、XML、JSON、CSS、JavaScript
- **验证器** - 邮箱、URL、JSON、XML、Cron 表达式
- **编码/解码器** - Base64、URL、HTML 实体、摩尔斯电码
- **计算器** - 百分比、子网、chmod 权限
- **文本工具** - 大小写转换、lorem ipsum、字数统计
- **网络工具** - IP 计算器、MAC 查找、DNS 工具
- **开发工具** - 正则表达式测试器、颜色选择器、HTTP 状态码

## 🤝 贡献指南

我们欢迎各种形式的贡献！以下是您可以提供帮助的方式：

### 开发环境设置

**推荐的 IDE 配置：**
- [VSCode](https://code.visualstudio.com/) 及以下扩展：
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

**VSCode 设置：**
```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### 项目设置
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 生产环境构建
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

### 添加新工具

使用我们的生成器创建新工具：
```bash
pnpm run script:create:tool my-tool-name
```

这将在 `src/tools/my-tool-name/` 目录中生成基础文件。它会在 `src/tools` 中创建一个目录，包含正确的文件，并在 `src/tools/index.ts` 中添加导入。你只需要将导入的工具添加到适当的分类中并开发该工具。

### TypeScript 中 `.vue` 导入的类型支持

TypeScript 默认无法处理 `.vue` 导入的类型信息，因此我们使用 `vue-tsc` 替代 `tsc` CLI 进行类型检查。在编辑器中，我们需要 [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) 来让 TypeScript 语言服务识别 `.vue` 类型。

如果你觉得独立的 TypeScript 插件不够快，Volar 还实现了一个性能更好的 [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)。你可以通过以下步骤启用它：

1. 禁用内置的 TypeScript 扩展
   1. 从 VSCode 的命令面板运行 `Extensions: Show Built-in Extensions`
   2. 找到 `TypeScript and JavaScript Language Features`，右键选择 `Disable (Workspace)`
2. 通过命令面板运行 `Developer: Reload Window` 重新加载 VSCode 窗口。

## 🌍 国际化

Next-Tools 支持 10 种语言：
- 🇺🇸 English (en)
- 🇨🇳 中文 (zh)
- 🇫🇷 Français (fr)
- 🇩🇪 Deutsch (de)
- 🇪🇸 Español (es)
- 🇵🇹 Português (pt)
- 🇷🇺 Русский (ru)
- 🇺🇦 Українська (uk)
- 🇳🇴 Norsk (no)
- 🇻🇳 Tiếng Việt (vi)

要贡献翻译，请编辑 `locales/` 目录中的 JSON 文件。

## 📊 分析集成

Next-Tools 支持可选的分析集成，用于使用情况跟踪。配置以下环境变量以启用分析：

### Vercel Analytics
```bash
VITE_ENABLE_VERCEL_ANALYTICS=true
VITE_DEBUG_VERCEL_ANALYTICS=false  # 可选调试模式
```

### Google Analytics 4
```bash
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Umami Analytics
```bash
VITE_UMAMI_WEBSITE_ID=your-website-id
VITE_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js  # 可选自定义 URL
```

分析仅在生产构建中运行且完全可选。

## 🍪 隐私同意管理

Next-Tools 内置了隐私同意管理系统，符合 GDPR、CCPA 等隐私法规要求。

### 功能特点
- **自动区域检测** - 自动检测用户所在区域，对 GDPR/CCPA 地区用户显示同意对话框
- **可自定义选项** - 用户可以选择全部接受、全部拒绝或自定义偏好设置
- **持久化存储** - 用户偏好设置保存在本地，跨会话保持有效
- **严格模式** - 可选模式，要求所有用户（无论地区）都必须进行同意确认

### 配置方式
```bash
# 启用同意管理
VITE_CONSENT_ENABLE=true

# 启用严格模式 - 要求所有用户都必须确认同意，无论其所在地区
VITE_CONSENT_STRICT=false
```

## 🗺️ 路线图与功能请求

查看 [issues](https://github.com/willjayyyy/next-tools/issues) 了解计划中的功能和即将推出的工具。

有新工具的想法？[提交功能请求](https://github.com/willjayyyy/next-tools/issues/new/choose)！

## 📄 许可证

本项目采用 [GNU General Public License v3.0](LICENSE) 许可证。

## 🙏 致谢

- 原 [it-tools](https://github.com/CorentinTh/it-tools) 项目作者 Corentin Thomasset
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [shadcn-vue](https://www.shadcn-vue.com/) - Vue 3 组件库
- [Vite](https://vitejs.dev/) - 快速构建工具
- 所有优秀的[贡献者](https://github.com/willjayyyy/next-tools/graphs/contributors)！

---

<div align="center">
用 ❤️ 制作，由 <a href="https://github.com/willjayyyy">Will Jay</a> 维护

</div>
