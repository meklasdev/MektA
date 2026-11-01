# Application routing

MektA Studio is a single desktop workspace built with Next.js App Router.

## Routes

- / — desktop workspace and onboarding
- /privacy — privacy policy
- /terms — terms of use

Electron loads the static export from resources/app/out/index.html. Browser mode and desktop mode share the same React UI.

## Data routing

The UI selects one data source at startup:

- local source when Supabase variables are absent,
- Supabase source when both public variables are present.

Both sources expose the same project and profile operations, so feature code does not know where data is stored.
