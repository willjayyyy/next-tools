# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## Version 1.3.3

### Chores
- **icons**: update maskable PWA icons (192x192, 512x512) (bbe9673)

## Version 1.3.2

### Bug fixes
- **command-palette**: prevent default Ctrl/Cmd+K only on platform using useMagicKeys options (87f6d61)

### Chores
-  update changelog and base layout tweaks (4d25997)

## Version 1.3.1

### Chores
- **icons**: update PWA manifest, add maskable and non-maskable desktop icons, and update meta links (a0f474c)

## Version 1.3.0

### Features
-  add figlet fonts for ASCII text generator (a1616bf)
-  update PWA icons and manifest configuration (4a6cf41)

### Bug fixes
-  resolve TypeScript type errors in meta-tag generator (738daaa)

### Refactoring
-  clean up configuration and remove unused settings (e391d31)
-  remove Plausible Analytics integration (bf5916b)
-  remove naive-ui components and dependencies (1ada4ca)

### Chores
-  update build scripts and tooling configuration (f52dd8d)
-  remove unused dependencies (1b8cde5)

### Style
-  migrate components to Tailwind CSS and update styling (462ce04)

## Version 2025.12.28-e50ebc7

### Features
-  bind dev server to 0.0.0.0 for network access (f7fcf72)

### Bug fixes
-  add absolute paths to HTML resource links (e50ebc7)

### Refactoring
-  unify social sharing meta tags in App.vue (38d2131)

## Version 2025.12.28-c200c88

### Features
-  enhance PWA icons and internationalization (c200c88)

## Version 2025.12.28-9a070db

### Features
-  update domain from vercel.app and tech to next-tools.dev (b8599b6)

### Refactoring
-  remove unplugin-icons types from vitest config (9a070db)

## Version 2025.12.28-114c5d5

### Other
-   ()

## Version 2025.12.28-77148e1

### Features
-  add internationalization for command palette features (7cc0710)
-  add tool visit tracking to router navigation guard (214969a)
-  add recent tools feature to command palette (4746a82)

### Refactoring
-  clean up dependencies and build configuration (77148e1)
-  normalize localStorage key naming convention (30490be)
-  migrate from mdi icons to lucide-vue-next (ab472ce)

## [2025.12.28-839e753] - 2025-12-28

### Features
- **PWA Support**: Add PWA icons and update manifest configuration
- **Internationalization**: Internationalize home page title for all 10 supported languages

### Bug fixes
- **Color Picker**: Resolve color picker initialization issues with 8-bit hex colors
- **Tool Locales**: Update tool locales and utilities for consistency

## [Next-Tools] - Fork & Refactor (2024-12-XX)

### Breaking Changes
- **Fork**: This project is now a fork of the original [it-tools](https://github.com/CorentinTh/it-tools) project
- **UI Refactor**: Migrated from Naive UI to [shadcn-vue](https://www.shadcn-vue.com/) component library
- **Architecture**: Updated build system, tooling, and project structure
- **Branding**: Updated all documentation, README files, and project metadata for Next-Tools

### Features
- **UI Modernization**: Complete redesign using shadcn-vue components and Tailwind CSS
- **Performance**: Optimized build system with Vite and improved TypeScript support
- **Internationalization**: Enhanced multi-language support (10 languages)
- **Documentation**: Comprehensive README files in multiple languages

### Refactoring
- **Component Library**: Replaced Naive UI with shadcn-vue
- **Build System**: Updated Vite configuration and tooling
- **Project Structure**: Reorganized file structure and dependencies
- **Scripts**: Updated development and build scripts

### Chores
- **Dependencies**: Updated all project dependencies
- **Licensing**: Maintained GPL-3.0 compliance
- **Documentation**: Updated all documentation and metadata
