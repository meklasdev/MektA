# Privacy notice

## Local mode

Local mode stores workspace records on the user's machine in the application data directory. MektA does not upload local project data automatically.

## Cloud mode

When Supabase variables are configured, authentication and workspace records are sent to the configured Supabase project. Row-level security limits records to their owner.

MektA does not place a service-role key in the desktop renderer. OpenCode commands are run locally through the Electron bridge.

## User control

Users can remove local data by deleting the workspace file from the application data directory. Cloud data is controlled through the configured Supabase project.
