
<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="next-tools-logo-dark.png" />
  <img src="next-tools-logo-light.png" alt="Next-Tools Logo" width="500"/>
</picture>

**Una colección de herramientas prácticas en línea para desarrolladores y profesionales de TI**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub stars](https://img.shields.io/github/stars/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/issues)

**🗣️ Idiomas:** [English](../README.md) • [中文](README.zh.md) • [Français](README.fr.md) • [Deutsch](README.de.md) • Español • [Português](README.pt.md) • [Русский](README.ru.md) • [Українська](README.uk.md) • [Norsk](README.no.md) • [Tiếng Việt](README.vi.md)

[🌐 ¡Pruébalo en línea!](https://next-tools.dev) •
[📖 Acerca de](https://next-tools.dev/about) •
[🐛 Reportar error](https://github.com/willjayyyy/next-tools/issues) •
[💡 Solicitar función](https://github.com/willjayyyy/next-tools/issues/new/choose)

</div>

---

> **Nota:** Este es un fork del proyecto original [it-tools](https://github.com/CorentinTh/it-tools), refactorizado y mantenido por [Will Jay](https://github.com/willjayyyy). Este proyecto está bajo licencia GNU GPLv3.

## ✨ Características

- 🔧 **120+ Herramientas para desarrolladores** - Desde conversión de datos hasta análisis de red
- 🎨 **Interfaz moderna** - Interfaz limpia e intuitiva construida con Vue.js 3
- 🔒 **Privacidad primero** - Todas las herramientas se ejecutan localmente en tu navegador
- 🌍 **10 idiomas** - Soporte completo de internacionalización
- 📱 **Diseño responsive** - Funciona perfectamente en todos los dispositivos
- ⚡ **Rápido y ligero** - Construido con Vite para un rendimiento óptimo
- 🆓 **Gratuito y de código abierto** - Licenciado bajo GPL-3.0, gratuito para siempre

## 🚀 Inicio rápido

### Uso en línea
Visita [next-tools.dev](https://next-tools.dev) para usar todas las herramientas directamente en tu navegador.

### Auto-alojamiento

#### Desde Docker Hub:
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  willjayyyy/next-tools:latest
```

#### Desde GitHub Packages:
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  ghcr.io/willjayyyy/next-tools:latest
```

#### Desarrollo local:
```bash
# Clonar el repositorio
git clone https://github.com/willjayyyy/next-tools.git
cd next-tools

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

## 🛠️ Categorías de herramientas

- **Convertidores** - JSON, XML, YAML, CSV, Base64, codificación URL
- **Generadores** - UUID, contraseña, código QR, hash, JWT
- **Formateadores** - SQL, XML, JSON, CSS, JavaScript
- **Validadores** - Email, URL, JSON, XML, expresiones cron
- **Codificadores/Decodificadores** - Base64, URL, entidades HTML, código Morse
- **Calculadoras** - Porcentaje, subred, permisos chmod
- **Herramientas de texto** - Convertidor de mayúsculas/minúsculas, lorem ipsum, contador de palabras
- **Herramientas de red** - Calculadora IP, búsqueda MAC, herramientas DNS
- **Desarrollo** - Probador de expresiones regulares, selector de colores, códigos de estado HTTP

## 🤝 Contribuir

¡Aceptamos contribuciones! Aquí está cómo puedes ayudar:

### Configuración de IDE recomendada

**Configuración IDE recomendada:**
- [VSCode](https://code.visualstudio.com/) con las siguientes extensiones:
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

**Configuración de VSCode:**
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

### Configuración del proyecto
```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Ejecutar pruebas
pnpm test

# Revisar código
pnpm lint
```

### Agregar una nueva herramienta

Crear una nueva herramienta con nuestro generador:
```bash
pnpm run script:create:tool my-tool-name
```

Esto generará los archivos base en `src/tools/my-tool-name/`. Creará un directorio en `src/tools` con los archivos correctos y agregará la importación en `src/tools/index.ts`. Solo necesitarás agregar la herramienta importada en la categoría apropiada y desarrollar la herramienta.

### Soporte de tipos para importaciones `.vue` en TS

TypeScript no puede manejar información de tipos para importaciones `.vue` por defecto, por lo que reemplazamos el CLI `tsc` con `vue-tsc` para la verificación de tipos. En los editores, necesitamos [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) para que el servicio de lenguaje TypeScript reconozca los tipos `.vue`.

Si el plugin TypeScript independiente no te parece lo suficientemente rápido, Volar también ha implementado un [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) más eficiente. Puedes habilitarlo siguiendo estos pasos:

1. Deshabilitar la extensión TypeScript integrada
   1. Ejecuta `Extensions: Show Built-in Extensions` desde la paleta de comandos de VSCode
   2. Encuentra `TypeScript and JavaScript Language Features`, haz clic derecho y selecciona `Disable (Workspace)`
2. Recarga la ventana de VSCode ejecutando `Developer: Reload Window` desde la paleta de comandos.

## 🌍 Internacionalización

Next-Tools soporta 10 idiomas:
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

Para contribuir con traducciones, edita los archivos JSON en el directorio `locales/`.

## 📊 Integración de Analytics

Next-Tools soporta integración opcional de analytics para seguimiento de uso. Configure estas variables de entorno para habilitar analytics:

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

Los analytics solo se ejecutan en builds de producción y son completamente opcionales.

## 🍪 Gestión del Consentimiento

Next-Tools incluye un sistema de gestión de consentimiento integrado que cumple con GDPR, CCPA y otras regulaciones de privacidad.

### Características
- **Detección automática de región** - Detecta automáticamente la región del usuario y muestra el diálogo de consentimiento para regiones GDPR/CCPA
- **Opciones personalizables** - Los usuarios pueden aceptar todo, rechazar todo o personalizar sus preferencias
- **Almacenamiento persistente** - Las preferencias del usuario se guardan localmente y se respetan entre sesiones
- **Modo estricto** - Modo opcional para requerir consentimiento de todos los usuarios independientemente de la región

### Configuración
```bash
# Habilitar gestión de consentimiento
VITE_CONSENT_ENABLE=true

# Habilitar modo estricto - requerir consentimiento de todos los usuarios independientemente de la región
VITE_CONSENT_STRICT=false
```

## 🗺️ Hoja de ruta y solicitudes de funciones

Consulta los [issues](https://github.com/willjayyyy/next-tools/issues) para ver las funciones planificadas y las herramientas próximas.

¿Tienes una idea para una herramienta? [¡Envía una solicitud de función](https://github.com/willjayyyy/next-tools/issues/new/choose)!

## 📄 Licencia

Este proyecto está bajo la [GNU General Public License v3.0](LICENSE).

## 🙏 Agradecimientos

- Proyecto original [it-tools](https://github.com/CorentinTh/it-tools) por Corentin Thomasset
- [Vue.js](https://vuejs.org/) - Framework JavaScript progresivo
- [shadcn-vue](https://www.shadcn-vue.com/) - Biblioteca de componentes Vue 3
- [Vite](https://vitejs.dev/) - Herramienta de construcción rápida
- Todos nuestros increíbles [colaboradores](https://github.com/willjayyyy/next-tools/graphs/contributors)!

---

<div align="center">
Hecho con ❤️ por <a href="https://github.com/willjayyyy">Will Jay</a>

</div>
