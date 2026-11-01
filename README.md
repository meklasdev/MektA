# MektA Studio

MektA Studio is a free, local-first desktop workspace for developers. It manages projects, runs OpenCode commands, stores plugin integrations and optionally uses Supabase for authenticated cloud data.

The app works without an account, API key or paid service:

- local workspace storage,
- guided first-launch onboarding,
- project CRUD,
- OpenCode runtime status,
- optional Supabase Auth/Postgres/RLS,
- Windows installer and GitHub Releases workflow.

## Run locally

Requirements: Node.js 22+, npm 10+, Windows for the desktop build.

~~~bash
npm install
npm run desktop:dev
~~~

Without Supabase variables, browser development uses localStorage and the packaged desktop app uses %APPDATA%/mekta/mekta-workspace.json.

## Build Windows installer

~~~bash
npm run desktop:build
~~~

The installer is generated in `release/`.

## Optional cloud mode

Copy .env.example to .env.local, add the public Supabase URL and anon key, then run supabase/schema.sql. The service-role key must never be placed in the client.

## Documentation

- [Getting started](docs/getting-started.md)
- [Local-first production setup](docs/production-setup.md)
- [Free launch and GitHub Releases](docs/free-launch.md)
- [Plugin architecture](docs/plugins.md)
- [OpenCode and MCP](docs/opencode-mcp.md)
- [Screenshots and product map](docs/screenshots.md)
- [Design system](docs/studio-design-system.md)
- [Privacy](docs/privacy.md)
- [Terms](docs/terms.md)

## Verification

~~~bash
npx tsc --noEmit --pretty false
npm run build
~~~

MektA is distributed without a paid Windows code-signing certificate, so SmartScreen may show a first-run warning.
