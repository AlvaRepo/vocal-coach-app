# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-04-18

### Added
- **Supabase Integration**: Real database persistence replacing localStorage.
- **Authentication**: Real login/logout flow using Supabase Auth.
- **Protected Routes**: Middleware to prevent unauthorized access.
- **Storage Service**: Infrastructure ready for audio and image uploads.
- **Repository Pattern**: Clean architecture implementation for Supabase entities.
- **ESLint 9 Support**: New `eslint.config.js` implementation.

### Changed
- **Build System**: Improved Vitest configuration to exclude E2E tests.
- **Style**: Cyber-Soul aesthetic refinements in components.
- **Deployment**: Configured Vercel with correct Vite presets and base path.

### Fixed
- Build failures caused by missing ESLint configuration.
- Type errors in repository mocks and unit tests.
- Vitest/Playwright test execution conflicts.

## [0.1.0] - 2026-04-09

### Added
- Initial MVP with localStorage.
- Dashboard with key metrics.
- Students management (CRUD).
- Core UI components with shadcn/ui.
- Seed data for demo purposes.
