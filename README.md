# Mekta Framework 💜

The Future of Agentic UI. A custom frontend framework that compiles `.mek` files into React-compatible JavaScript.

## Features

- **Purple Dashboard CLI**: Beautiful ASCII art and visual feedback.
- **Agentic AI Integration**: In-built AI prompt to UI generation.
- **Presets**: Standard Web, **FiveM UI**, and Landing Page templates.
- **React-Compatible**: Compiles to standard `createElement` calls.

## Installation

```bash
npm install
```

## CLI Usage

### Create a new project
```bash
node cli/index.js newproject
```
Follow the interactive prompts to scaffold a new project from presets (e.g. FiveM UI).

### Build a .mek file
```bash
node cli/index.js build <file.mek>
```

### Run dev server
```bash
node cli/index.js dev
```

## AI Agent Builder

Start the server and use the `/generate` endpoint:

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Generate a modern fivem menu"}'
```

## Project Structure

- `core/`: Compiler, parser, templates, and runtime.
- `server/`: Express server for AI generation and SSR.
- `cli/`: Dashboard CLI tool.
- `examples/`: Sample `.mek` files.
