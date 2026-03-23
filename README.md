# Mekta Framework

A custom frontend framework that compiles `.mek` files into React-compatible JavaScript.

## Installation

```bash
npm install
```

## Usage

### CLI

The `mekta` command is available via `npm run`.

**Build a .mek file:**
```bash
npm run build -- examples/app.mek
```
This will generate `examples/app.js`.

**Start the dev server:**
```bash
npm run dev
```

### AI Generation API

The server provides a POST endpoint to generate and render `.mek` code.

**Endpoint:** `POST /generate`
**Body:** `{"prompt": "Your prompt here"}`

**Example:**
```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A modern dashboard"}'
```

## Project Structure

- `core/`: Compiler, parser, generator, and runtime.
- `server/`: Express server for AI generation and SSR.
- `cli/`: Command-line interface.
- `examples/`: Sample `.mek` files.
