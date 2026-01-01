
<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/next-tools-logo-dark.png" />
  <img src="docs/next-tools-logo-light.png" alt="Next-Tools Logo" width="500"/>
</picture>

**A collection of practical online tools for developers and IT professionals**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub stars](https://img.shields.io/github/stars/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/issues)

**🗣️ Languages:** English • [中文](docs/README.zh.md) • [Français](docs/README.fr.md) • [Deutsch](docs/README.de.md) • [Español](docs/README.es.md) • [Português](docs/README.pt.md) • [Русский](docs/README.ru.md) • [Українська](docs/README.uk.md) • [Norsk](docs/README.no.md) • [Tiếng Việt](docs/README.vi.md)

[🌐 Try it online!](https://next-tools.dev) •
[📖 About](https://next-tools.dev/about) •
[🐛 Report Bug](https://github.com/willjayyyy/next-tools/issues) •
[💡 Request Feature](https://github.com/willjayyyy/next-tools/issues/new/choose)

</div>

---

> **Note:** This is a fork of the original [it-tools](https://github.com/CorentinTh/it-tools) project, refactored and maintained by [Will Jay](https://github.com/willjayyyy). This project is licensed under GNU GPLv3.

## ✨ Features

- 🔧 **120+ Developer Tools** - From data conversion to network analysis
- 🎨 **Modern UI** - Clean, intuitive interface built with Vue.js 3
- 🔒 **Privacy First** - All tools run locally in your browser
- 🌍 **10 Languages** - Full internationalization support
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance
- 🆓 **Free & Open Source** - GPL-3.0 licensed, forever free

## 🚀 Quick Start

### Online Usage
Visit [next-tools.dev](https://next-tools.dev) to use all tools directly in your browser.

### Self-Hosting

#### From Docker Hub:
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  willjayyyy/next-tools:latest
```

#### From GitHub Packages:
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  ghcr.io/willjayyyy/next-tools:latest
```

#### Local Development:
```bash
# Clone the repository
git clone https://github.com/willjayyyy/next-tools.git
cd next-tools

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🛠️ Tool Categories

- **Converters** - JSON, XML, YAML, CSV, Base64, URL encoding
- **Generators** - UUID, Password, QR Code, Hash, JWT
- **Formatters** - SQL, XML, JSON, CSS, JavaScript
- **Validators** - Email, URL, JSON, XML, Cron expressions
- **Encoders/Decoders** - Base64, URL, HTML entities, Morse code
- **Calculators** - Percentage, subnet, chmod permissions
- **Text Tools** - Case converter, lorem ipsum, word counter
- **Network Tools** - IP calculator, MAC lookup, DNS tools
- **Development** - Regex tester, color picker, HTTP status codes

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

**Recommended IDE Setup:**
- [VSCode](https://code.visualstudio.com/) with extensions:
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

**VSCode Settings:**
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

### Project Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

### Adding a New Tool

Create a new tool with our generator:
```bash
pnpm run script:create:tool my-tool-name
```

This will generate the boilerplate files in `src/tools/my-tool-name/`. It will create a directory in `src/tools` with the correct files, and add the import in `src/tools/index.ts`. You will just need to add the imported tool in the proper category and develop the tool.

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## 🌍 Internationalization

Next-Tools supports 10 languages:
- 🇺🇸 English (en)
- 🇨🇳 Chinese (zh)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇵🇹 Portuguese (pt)
- 🇷🇺 Russian (ru)
- 🇺🇦 Ukrainian (uk)
- 🇳🇴 Norwegian (no)
- 🇻🇳 Vietnamese (vi)

To contribute translations, edit the JSON files in the `locales/` directory.

## 📊 Analytics Integration

Next-Tools supports optional analytics integration for usage tracking. Configure these environment variables to enable analytics:

### Vercel Analytics
```bash
VITE_ENABLE_VERCEL_ANALYTICS=true
VITE_DEBUG_VERCEL_ANALYTICS=false  # Optional debug mode
```

### Google Analytics 4
```bash
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Umami Analytics
```bash
VITE_UMAMI_WEBSITE_ID=your-website-id
VITE_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js  # Optional custom URL
```

Analytics only run in production builds and are completely optional.

## 🍪 Privacy Consent

Next-Tools includes a built-in privacy consent management system that complies with GDPR, CCPA, and other privacy regulations.

### Features
- **Automatic Region Detection** - Automatically detects user region and shows consent dialog for GDPR/CCPA regions
- **Customizable Options** - Users can accept all, reject all, or customize their preferences
- **Persistent Storage** - User preferences are saved locally and respected across sessions
- **Strict Mode** - Optional mode to require consent from all users regardless of region

### Configuration
```bash
# Enable consent management
VITE_CONSENT_ENABLE=true

# Enable strict mode - require consent from all users regardless of region
VITE_CONSENT_STRICT=false
```

## 🗺️ Roadmap & Feature Requests

Check the [issues](https://github.com/willjayyyy/next-tools/issues) to see planned features and upcoming tools.

Have an idea for a new tool? [Submit a feature request](https://github.com/willjayyyy/next-tools/issues/new/choose)!

## 📄 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

## 🙏 Acknowledgments

- Original [it-tools](https://github.com/CorentinTh/it-tools) project by Corentin Thomasset
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [shadcn-vue](https://www.shadcn-vue.com/) - Vue 3 component library
- [Vite](https://vitejs.dev/) - Fast build tool
- All our amazing [contributors](https://github.com/willjayyyy/next-tools/graphs/contributors)!

---

<div align="center">
Made with ❤️ by <a href="https://github.com/willjayyyy">Will Jay</a>
</div>
