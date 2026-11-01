# MektA Studio production setup

## 1. Supabase

Create a Supabase project, then run 'supabase/schema.sql' in the SQL editor. The schema creates profiles, projects, and plugin installation tables with owner-only RLS policies.

In '.env.local', set:

~~~env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_ANON_KEY
~~~

Supabase is optional. When the variables are missing, MektA automatically uses local-first mode. The desktop app stores user-created workspace data in '%APPDATA%/mekta/mekta-workspace.json'; browser development uses localStorage. It never inserts demo rows.

## 2. Local verification

~~~bash
npm install
npx tsc --noEmit --pretty false
npm run build
npm run desktop:dev
~~~

## 3. Windows installer

~~~bash
npm run desktop:build
~~~

The installer is written to the configured `release/` directory. Electron loads the static export from `resources/app/out/index.html`.

## 4. Vercel

Import the repository into Vercel, choose the Next.js preset, and add the same two 'NEXT_PUBLIC_*' variables in Project Settings. Deploy only after the SQL schema has been applied to the production Supabase project.

## 5. Auth and data boundary

Authentication is handled by Supabase Auth. Every project and plugin query uses the authenticated browser session. PostgreSQL RLS requires 'auth.uid() = owner_id'; the client never receives a service-role key.

OpenCode commands are available only in the packaged desktop bridge and are restricted by the Electron allowlist. Browser mode reports that the desktop bridge is unavailable.
