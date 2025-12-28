# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
