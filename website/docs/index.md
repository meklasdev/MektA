# Mekta Documentation (V1.2.0)

## Architecture Overview
Mekta is built around a **Multi-Target Compiler** that understands a custom JSX-like syntax (`.mek`). It transforms this syntax into different output formats depending on your needs.

## Targets

### 1. React (Default)
Compiles `.mek` into standard React `createElement` calls. Ideal for modern SPA/SSR apps.
```bash
mekta build app.mek --target=react
```

### 2. Static HTML
Compiles `.mek` into raw, static HTML files. Perfect for fast landing pages and simple sites.
```bash
mekta build app.mek --target=html
```

### 3. PHP Templates
Compiles `.mek` into PHP files that use `echo` statements to output the HTML. Ideal for legacy integrations or specialized backend systems.
```bash
mekta build app.mek --target=php
```

## The TUI Dashboard
Mekta features a **High-Fidelity TUI** (`mekta dashboard`) inspired by the sleekest developer tools. It provides real-time system status and an integrated command shell for a professional, "Next.js-like" experience.

---
[Return to Mekta Home](../index.html)
