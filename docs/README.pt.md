
<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="next-tools-logo-dark.png" />
  <img src="next-tools-logo-light.png" alt="Next-Tools Logo" width="500"/>
</picture>

**Uma coleção de ferramentas práticas online para desenvolvedores e profissionais de TI**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub stars](https://img.shields.io/github/stars/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/issues)

**🗣️ Idiomas:** [English](../README.md) • [中文](README.zh.md) • [Français](README.fr.md) • [Deutsch](README.de.md) • [Español](README.es.md) • Português • [Русский](README.ru.md) • [Українська](README.uk.md) • [Norsk](README.no.md) • [Tiếng Việt](README.vi.md)

[🌐 Experimente online!](https://next-tools.dev) •
[📖 Sobre o projeto](https://next-tools.dev/about) •
[🐛 Reportar bug](https://github.com/willjayyyy/next-tools/issues) •
[💡 Solicitar funcionalidade](https://github.com/willjayyyy/next-tools/issues/new/choose)

</div>

---

> **Nota:** Este é um fork do projeto original [it-tools](https://github.com/CorentinTh/it-tools), refatorado e mantido por [Will Jay](https://github.com/willjayyyy). Este projeto está sob licença GNU GPLv3.

## ✨ Funcionalidades

- 🔧 **120+ Ferramentas para desenvolvedores** - Da conversão de dados à análise de rede
- 🎨 **Interface moderna** - Interface limpa e intuitiva construída com Vue.js 3
- 🔒 **Privacidade em primeiro lugar** - Todas as ferramentas são executadas localmente no seu navegador
- 🌍 **10 idiomas** - Suporte completo de internacionalização
- 📱 **Design responsivo** - Funciona perfeitamente em todos os dispositivos
- ⚡ **Rápido e leve** - Construído com Vite para desempenho ótimo
- 🆓 **Grátis e open source** - Licenciado sob GPL-3.0, gratuito para sempre

## 🚀 Início rápido

### Uso online
Visite [next-tools.dev](https://next-tools.dev) para usar todas as ferramentas diretamente no seu navegador.

### Auto-hospedagem

#### Do Docker Hub:
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  willjayyyy/next-tools:latest
```

#### Do GitHub Packages:
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  ghcr.io/willjayyyy/next-tools:latest
```

#### Desenvolvimento local:
```bash
# Clonar o repositório
git clone https://github.com/willjayyyy/next-tools.git
cd next-tools

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

## 🛠️ Categorias de ferramentas

- **Conversores** - JSON, XML, YAML, CSV, Base64, codificação URL
- **Geradores** - UUID, senha, código QR, hash, JWT
- **Formatadores** - SQL, XML, JSON, CSS, JavaScript
- **Validadores** - Email, URL, JSON, XML, expressões cron
- **Codificadores/Decodificadores** - Base64, URL, entidades HTML, código Morse
- **Calculadoras** - Porcentagem, sub-rede, permissões chmod
- **Ferramentas de texto** - Conversor de maiúsculas/minúsculas, lorem ipsum, contador de palavras
- **Ferramentas de rede** - Calculadora IP, pesquisa MAC, ferramentas DNS
- **Desenvolvimento** - Testador de expressões regulares, seletor de cores, códigos de status HTTP

## 🤝 Contribuição

Aceitamos contribuições! Aqui está como você pode ajudar:

### Configuração de IDE recomendada

**Configuração IDE recomendada:**
- [VSCode](https://code.visualstudio.com/) com as seguintes extensões:
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

**Configurações do VSCode:**
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

### Configuração do projeto
```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Construir para produção
pnpm build

# Executar testes
pnpm test

# Verificar código
pnpm lint
```

### Adicionar uma nova ferramenta

Criar uma nova ferramenta com nosso gerador:
```bash
pnpm run script:create:tool my-tool-name
```

Isso gerará os arquivos base em `src/tools/my-tool-name/`. Criará um diretório em `src/tools` com os arquivos corretos e adicionará a importação em `src/tools/index.ts`. Você só precisará adicionar a ferramenta importada na categoria apropriada e desenvolver a ferramenta.

### Suporte de tipo para importações `.vue` em TS

TypeScript não pode lidar com informações de tipo para importações `.vue` por padrão, então substituímos o CLI `tsc` por `vue-tsc` para verificação de tipo. Nos editores, precisamos do [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) para que o serviço de linguagem TypeScript reconheça os tipos `.vue`.

Se o plugin TypeScript independente não parecer rápido o suficiente para você, o Volar também implementou um [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) mais eficiente. Você pode habilitá-lo seguindo estes passos:

1. Desabilitar a extensão TypeScript integrada
   1. Execute `Extensions: Show Built-in Extensions` na paleta de comandos do VSCode
   2. Encontre `TypeScript and JavaScript Language Features`, clique com o botão direito e selecione `Disable (Workspace)`
2. Recarregue a janela do VSCode executando `Developer: Reload Window` na paleta de comandos.

## 🌍 Internacionalização

Next-Tools suporta 10 idiomas:
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

Para contribuir com traduções, edite os arquivos JSON no diretório `locales/`.

## 📊 Integração de Analytics

Next-Tools suporta integração opcional de analytics para rastreamento de uso. Configure estas variáveis de ambiente para habilitar analytics:

### Vercel Analytics
```bash
VITE_ENABLE_VERCEL_ANALYTICS=true
VITE_DEBUG_VERCEL_ANALYTICS=false  # Modo debug opcional
```

### Google Analytics 4
```bash
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Umami Analytics
```bash
VITE_UMAMI_WEBSITE_ID=your-website-id
VITE_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js  # URL personalizada opcional
```

Os analytics só executam em builds de produção e são completamente opcionais.

## 🍪 Gestão de Consentimento

Next-Tools inclui um sistema de gestão de consentimento integrado que está em conformidade com GDPR, CCPA e outras regulamentações de privacidade.

### Funcionalidades
- **Detecção automática de região** - Detecta automaticamente a região do usuário e exibe o diálogo de consentimento para regiões GDPR/CCPA
- **Opções personalizáveis** - Os usuários podem aceitar tudo, rejeitar tudo ou personalizar suas preferências
- **Armazenamento persistente** - As preferências do usuário são salvas localmente e respeitadas entre sessões
- **Modo estrito** - Modo opcional para exigir consentimento de todos os usuários independentemente da região

### Configuração
```bash
# Habilitar gestão de consentimento
VITE_CONSENT_ENABLE=true

# Habilitar modo estrito - exigir consentimento de todos os usuários independentemente da região
VITE_CONSENT_STRICT=false
```

## 🗺️ Roteiro e solicitações de recursos

Confira os [issues](https://github.com/willjayyyy/next-tools/issues) para ver os recursos planejados e as ferramentas futuras.

Tem uma ideia para uma ferramenta? [Envie uma solicitação de recurso](https://github.com/willjayyyy/next-tools/issues/new/choose)!

## 📄 Licença

Este projeto está sob a [GNU General Public License v3.0](LICENSE).

## 🙏 Agradecimentos

- Projeto original [it-tools](https://github.com/CorentinTh/it-tools) por Corentin Thomasset
- [Vue.js](https://vuejs.org/) - Framework JavaScript progressivo
- [shadcn-vue](https://www.shadcn-vue.com/) - Biblioteca de componentes Vue 3
- [Vite](https://vitejs.dev/) - Ferramenta de construção rápida
- Todos os nossos incríveis [colaboradores](https://github.com/willjayyyy/next-tools/graphs/contributors)!

---

<div align="center">
Feito com ❤️ por <a href="https://github.com/willjayyyy">Will Jay</a>

</div>
