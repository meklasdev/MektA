# Addons and plugins

MektA separates the desktop shell from integrations. A plugin needs a real provider, a permission boundary and a persisted installation record.

The plugin installation model stores a key, version, JSON configuration, owner id and timestamps. Supabase protects these rows with owner-only RLS. Local mode keeps the installed-plugin list in the local workspace file.

## Adding a plugin

1. Define its capability and required permissions.
2. Add a versioned installation entry through the integration layer.
3. Never mark a plugin connected until its provider returns a successful health check.
4. Show an explicit empty or unavailable state when the registry is not configured.

The UI never pretends that a marketplace or provider is connected.
