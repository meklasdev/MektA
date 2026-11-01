# Getting started

## First launch

1. Run npm run desktop:dev or install the Windows installer.
2. Enter your name and workspace name.
3. Create the first project or skip it.
4. Check OpenCode in Agents & MCP.
5. Use Overview, Projects, Plugins and Settings.

Onboarding does not create demo rows. Every record shown after setup was created by the user.

## Local mode

Local mode is the default. It needs no Supabase account or API key. Desktop data is stored in %APPDATA%/mekta/mekta-workspace.json. Browser development uses localStorage.

## Cloud mode

Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before building. Sessions use Supabase Auth and data is protected by PostgreSQL RLS from supabase/schema.sql.

## Commands

~~~bash
npm run dev
npm run build
npm run desktop:dev
npm run desktop:build
~~~

The legacy CLI remains available for compatibility, but the primary product is MektA Studio.
