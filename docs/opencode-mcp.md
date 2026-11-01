# OpenCode and MCP

## OpenCode

The packaged desktop app checks the local OpenCode executable and shows its version in Agents & MCP. Commands are restricted to OpenCode and approved MektA project commands.

Local commands run from the packaged workspace. Browser mode cannot access the desktop bridge and reports that honestly.

## MCP

MCP connections are not marked active until a real provider and credentials are configured. The current screen is an integration boundary, not a fake marketplace.

When adding an MCP provider:

1. define the provider and permission scope,
2. store secrets outside the renderer,
3. add a health check,
4. show connected status only after a successful check,
5. expose disconnect and revoke actions.
