# Contributing to MektA

Thank you for helping improve MektA. The project is a local-first desktop workspace and multi-stack UI framework for React, PHP, FiveM/NUI and agent-assisted development.

## Before opening a change

1. Search existing issues and pull requests.
2. For a bug, include a reproducible case and the expected behavior.
3. For a feature, describe the user workflow and why it belongs in the core product.
4. Do not include API keys, credentials, personal workspace files or generated installers in commits.

## Local setup

```bash
npm install
npm run dev
```

For the desktop shell:

```bash
npm run desktop:dev
```

## Required checks

Run these before opening a pull request:

```bash
npm run typecheck
npm run test:compiler
npm run build
```

If you change Electron packaging or release workflows, also run `npm run desktop:build` on Windows when possible.

## Pull requests

- Keep pull requests focused and reviewable.
- Explain the user-visible result in the description.
- Include screenshots or a short recording for visual changes.
- Mention known limitations and verification performed.
- Preserve the local-first path: cloud services must remain optional unless the change explicitly changes that contract.

## Design and code standards

- Use strict TypeScript and existing utilities.
- Keep provider credentials outside renderer state and persisted JSON.
- Do not mark an integration connected without a real health check.
- Prefer accessible, responsive UI with clear empty, loading and error states.
- Add documentation when a feature changes the product workflow.
