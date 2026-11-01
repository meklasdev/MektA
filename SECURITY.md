# Security policy

## Supported versions

Security fixes are applied to the latest `main` branch and the latest published release.

## Reporting a vulnerability

Please do not open a public issue for a security vulnerability. Report it privately through the repository's GitHub security advisory flow or contact the repository owner at [@meklasdev](https://github.com/meklasdev).

Include:

- the affected version or commit,
- a clear description of the issue,
- reproduction steps or a minimal proof of concept,
- the potential impact,
- any suggested mitigation.

Please redact API keys, tokens, private workspace data and personal information from reports.

## Security boundaries

MektA is local-first. Provider secrets must stay in the operating system environment or credential store and must never be committed, returned to the renderer unnecessarily or written to workspace JSON. Electron command execution remains allowlisted by design.
