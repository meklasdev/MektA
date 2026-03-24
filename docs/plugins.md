# Mekta Plugin & Addon Architecture

Mekta is designed to be highly extensible. You can build custom "Architect Addons" that modify project scaffolding, inject dependencies, or provide specialized runtime routes.

## Creating an Addon

Addons are defined in `addons/addons.js`. An addon object consists of the following:

```javascript
{
  id: 'my-addon',
  name: 'My Custom Addon',
  package: 'npm-package-name', // Optional dependency to inject
  description: 'What this addon does.',
  onInstall: (projectPath) => {
    // Custom logic to scaffold files or modify configuration
  }
}
```

## Addon API

### `onInstall(projectPath)`
This function is called when a user installs the addon via the CLI (`mekta addons my-addon`) or the TUI dashboard. Use this to create boilerplate files, update `package.json`, or configure environment variables.

### `package` (String)
If specified, the framework will automatically add this package to the project's `dependencies` in `package.json`.

## Runtime Extensions

You can extend the Mekta server by adding routes to `server/server.js`. This is how "Mekta Vision" (the visual builder) is implemented.

1. Create a specialized route (e.g., `/builder`).
2. Serve a high-fidelity HTML/React interface.
3. Interact with the compiled `.mek` files via the `core/compiler.js` API.

## Built-in Addons

- **GSAP:** High-performance animations.
- **FiveM Bridge:** Specialized NUI resource scaffolding for game modders.
- **Mekta Vision:** A visual drag-and-drop builder for architects.
