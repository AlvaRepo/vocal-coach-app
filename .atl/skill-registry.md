# .atl/skill-registry.md

## Compact Rules (auto-injected)

### React & Frontend Standard
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS + Radix UI
- **Best Practices**: Use functional components, composition patterns, and clear separation of concerns in features/.
- **Storage**: Prefer Supabase Storage over binary blobs in DB.

### Supabase Integration
- **Mappers**: Use `keysToSnake` for requests and `keysToCamel` for responses.
- **Repository**: All entities MUST use `SupabaseRepository` or a specialized version of it.
- **Security**: Remind user about RLS (Row Level Security) and bucket permissions.

### Testing Standard (Strict TDD)
- **Unit**: Vitest. Follow AAA pattern (Arrange, Act, Assert).
- **E2E**: Playwright. Target specific data-testid or text content.
- **Priority**: Test business logic and integration points before UI polish.

## User Skills Registry

| Skill | Trigger Keywords | Path |
|-------|------------------|------|
| supabase-postgres-best-practices | postgres, schema, query, supabase | {project}/.agents/skills/supabase-postgres-best-practices |
| vercel-react-best-practices | react, components, next.js, hook | {project}/.agents/skills/vercel-react-best-practices |
| tailwind-css-patterns | tailwind, css, styling, layout | {project}/.agents/skills/tailwind-css-patterns |
| playwright-best-practices | e2e, test, staging, visual | {project}/.agents/skills/playwright-best-practices |
| vitest | vitest, unit test, mock | {project}/.agents/skills/vitest |

## Project Standards
- **Naming**: camelCase for TS/JS, snake_case for Postgres.
- **Architecture**: Domain entities in `src/entities`, features in `src/features`, shared utilities in `src/shared`.
