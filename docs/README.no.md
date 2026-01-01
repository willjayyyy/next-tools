
<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="next-tools-logo-dark.png" />
  <img src="next-tools-logo-light.png" alt="Next-Tools Logo" width="500"/>
</picture>

**En samling praktiske online-verktøy designet for utviklere og IT-profesjonelle**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub stars](https://img.shields.io/github/stars/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/issues)

**🗣️ Språk:** [English](../README.md) • [中文](README.zh.md) • [Français](README.fr.md) • [Deutsch](README.de.md) • [Español](README.es.md) • [Português](README.pt.md) • [Русский](README.ru.md) • [Українська](README.uk.md) • Norsk • [Tiếng Việt](README.vi.md)

[🌐 Prøv online!](https://next-tools.dev) •
[📖 Om prosjektet](https://next-tools.dev/about) •
[🐛 Rapporter feil](https://github.com/willjayyyy/next-tools/issues) •
[💡 Be om funksjon](https://github.com/willjayyyy/next-tools/issues/new/choose)

</div>

---

> **Merk:** Dette er en fork av det originale [it-tools](https://github.com/CorentinTh/it-tools) prosjektet, refactorisert og vedlikeholdt av [Will Jay](https://github.com/willjayyyy). Dette prosjektet er lisensiert under GNU GPLv3.

## ✨ Funksjoner

- 🔧 **120+ Utviklerverktøy** - Fra datakonvertering til nettverksanalyse
- 🎨 **Moderne grensesnitt** - Rent, intuitivt grensesnitt bygget med Vue.js 3
- 🔒 **Personvern først** - Alle verktøy kjører lokalt i nettleseren din
- 🌍 **10 språk** - Full støtte for internasjonalisering
- 📱 **Responsivt design** - Fungerer perfekt på alle enheter
- ⚡ **Raskt og lettvekts** - Bygget med Vite for optimal ytelse
- 🆓 **Gratis og åpen kildekode** - Lisensiert under GPL-3.0, gratis for alltid

## 🚀 Hurtigstart

### Online bruk
Besøk [next-tools.dev](https://next-tools.dev) for å bruke alle verktøyene direkte i nettleseren din.

### Selv-hosting

#### Fra Docker Hub:
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  willjayyyy/next-tools:latest
```

#### Fra GitHub Packages:
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  ghcr.io/willjayyyy/next-tools:latest
```

#### Lokal utvikling:
```bash
# Klon repositoriet
git clone https://github.com/willjayyyy/next-tools.git
cd next-tools

# Installer avhengigheter
pnpm install

# Start utviklingsserver
pnpm dev
```

## 🛠️ Verktøykategorier

- **Konverterere** - JSON, XML, YAML, CSV, Base64, URL-koding
- **Generatorer** - UUID, passord, QR-kode, hash, JWT
- **Formaterere** - SQL, XML, JSON, CSS, JavaScript
- **Validatorer** - E-post, URL, JSON, XML, cron-uttrykk
- **Koderere/Dekoderere** - Base64, URL, HTML-enheter, morsekode
- **Kalkulatorer** - Prosent, subnett, chmod-tillatelser
- **Tekstverktøy** - Saksomformer, lorem ipsum, ordteller
- **Nettverksverktøy** - IP-kalkulator, MAC-søk, DNS-verktøy
- **Utvikling** - Regex-tester, fargevelger, HTTP-statuskoder

## 🤝 Bidra

Vi setter pris på bidrag! Slik kan du hjelpe:

### Anbefalt IDE-oppsett

**Anbefalt IDE-oppsett:**
- [VSCode](https://code.visualstudio.com/) med utvidelser:
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

**VSCode-innstillinger:**
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

### Prosjektoppsett
```bash
# Installer avhengigheter
pnpm install

# Start utviklingsserver
pnpm dev

# Bygg for produksjon
pnpm build

# Kjør tester
pnpm test

# Sjekk kode
pnpm lint
```

### Legg til et nytt verktøy

Opprett et nytt verktøy med generatoren vår:
```bash
pnpm run script:create:tool my-tool-name
```

Dette vil generere basisfiler i `src/tools/my-tool-name/`. Det vil opprette en katalog i `src/tools` med de riktige filene og legge til importen i `src/tools/index.ts`. Du trenger bare å legge til det importerte verktøyet i riktig kategori og utvikle verktøyet.

### Typestøtte for `.vue` importer i TS

TypeScript kan ikke håndtere typeinformasjon for `.vue` importer som standard, så vi erstatter `tsc` CLI med `vue-tsc` for typesjekking. I editorer trenger vi [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) for å gjøre TypeScript-språktjenesten klar over `.vue` typer.

Hvis den frittstående TypeScript-pluginen ikke føles rask nok for deg, har Volar også implementert en mer effektiv [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669). Du kan aktivere den ved å følge disse trinnene:

1. Deaktiver den innebygde TypeScript-utvidelsen
   1. Kjør `Extensions: Show Built-in Extensions` fra VSCode sin kommandopalett
   2. Finn `TypeScript and JavaScript Language Features`, høyreklikk og velg `Disable (Workspace)`
2. Last inn VSCode-vinduet på nytt ved å kjøre `Developer: Reload Window` fra kommandopaletten.

## 🌍 Internasjonalisering

Next-Tools støtter 10 språk:
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

For å bidra med oversettelser, rediger JSON-filene i `locales/`-katalogen.

## 📊 Analytics Integrasjon

Next-Tools støtter valgfri analytics-integrasjon for brukssporing. Konfigurer disse miljøvariablene for å aktivere analytics:

### Vercel Analytics
```bash
VITE_ENABLE_VERCEL_ANALYTICS=true
VITE_DEBUG_VERCEL_ANALYTICS=false  # Valgfri debug-modus
```

### Google Analytics 4
```bash
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Umami Analytics
```bash
VITE_UMAMI_WEBSITE_ID=your-website-id
VITE_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js  # Valgfri tilpasset URL
```

Analytics kjører kun i produksjonsbygg og er helt valgfrie.

## 🍪 Samtykkebehandling

Next-Tools inkluderer et innebygd samtykkebehandlingssystem som overholder GDPR, CCPA og andre personvernforskrifter.

### Funksjoner
- **Automatisk regiondeteksjon** - Oppdager automatisk brukerens region og viser samtykkedialog for GDPR/CCPA-regioner
- **Tilpassbare alternativer** - Brukere kan godta alt, avvise alt eller tilpasse sine preferanser
- **Vedvarende lagring** - Brukerpreferanser lagres lokalt og respekteres på tvers av økter
- **Streng modus** - Valgfri modus for å kreve samtykke fra alle brukere uavhengig av region

### Konfigurasjon
```bash
# Aktiver samtykkebehandling
VITE_CONSENT_ENABLE=true

# Aktiver streng modus - krev samtykke fra alle brukere uavhengig av region
VITE_CONSENT_STRICT=false
```

## 🗺️ Veikart og funksjonsforespørsler

Sjekk [issues](https://github.com/willjayyyy/next-tools/issues) for å se planlagte funksjoner og kommende verktøy.

Har du en idé til et verktøy? [Send inn en funksjonsforespørsel](https://github.com/willjayyyy/next-tools/issues/new/choose)!

## 📄 Lisens

Dette prosjektet er lisensiert under [GNU General Public License v3.0](LICENSE).

## 🙏 Takk til

- Opprinnelig [it-tools](https://github.com/CorentinTh/it-tools) prosjekt av Corentin Thomasset
- [Vue.js](https://vuejs.org/) - Progressivt JavaScript-rammeverk
- [shadcn-vue](https://www.shadcn-vue.com/) - Vue 3 komponentbibliotek
- [Vite](https://vitejs.dev/) - Rask byggverktøy
- Alle våre fantastiske [bidragsytere](https://github.com/willjayyyy/next-tools/graphs/contributors)!

---

<div align="center">
Laget med ❤️ av <a href="https://github.com/willjayyyy">Will Jay</a>

</div>
