# Plugin architecture

Plugins are integrations, not fake catalog cards. Each integration owns a key, version, configuration schema and health check.

## Safety rules

- Keep credentials out of local JSON unless explicitly encrypted.
- Never ship a service-role key.
- Persist only the minimum configuration needed by the provider.
- Use owner-scoped Supabase policies.
- Display Not configured or Not detected when a provider is unavailable.

## Plugin lifecycle

discover -> install -> configure -> health check -> active -> disconnect

The current UI displays real installed records and honest empty states.
