# 🌌 Mekta Framework (v1.6.0-Architect)

<div align="center">
  <img src="mekta-logo.svg" width="220" alt="Mekta Logo" />
  <p><strong>High-Fidelity Virtual UI for the Next Generation of Builders</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blueviolet.svg)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/Version-1.6.0-indigo.svg)]()
  [![Framework](https://img.shields.io/badge/Framework-React--Compatible-blue.svg)]()
</div>

---

## ⚡ Overview

Mekta is a production-grade frontend framework designed for **Industrial Architecture**, **Game UI Resources**, and **Next-Gen Web Ecosystems**. It introduces the `.mek` DSL—a JSX-like syntax that compiles into optimized React-compatible JavaScript, Static HTML, or PHP.

---

## ▣ Features at a Glance

- **Multi-Target Compiler (v1.6):** Custom-built tokenizer and AST generator with intelligent tag mapping for React, static HTML, and PHP.
- **Architect Core Dashboard:** A professional slate-themed TUI dashboard for real-time project management, monitoring, and hot-reload.
- **Next.js Plus Routing:** Recursive file-system based routing with support for nested layouts (`layout.mek`), dynamic parameters (`[id]`), and automatic children injection.
- **Agent-Ready Architecture:** Designed specifically as a standardized target for AI-driven development and programmatic UI generation.
- **Stable Toolchain:** Built on industry-standard foundations: Ink 5, Express 4, and React 18.3.1.

---

## 🚀 Quick Start

Initialize your first project in seconds:

```bash
# Install dependencies
npm install

# Launch the Architect Dashboard
npx mekta dashboard

# Scaffold a modern project
npx mekta create my-app
```

---

## 📐 Architecture

### 1. The .mek DSL
Mekta components combine the simplicity of JSX with powerful framework-level directives.

**`pages/index.mek`**
```jsx
<layout>
  <header>
    <text class="brand">MEKTA CORE</text>
  </header>
  <main>
    <hero m-if={user.loggedIn}>
      <text>Welcome back, {user.name}!</text>
    </hero>
    <grid>
      <m-for item="feature in features">
        <card title={feature.name} />
      </m-for>
    </grid>
  </main>
</layout>
```

### 2. Multi-Target Compilation
Build for any environment with a single source:

- **React:** `npx mekta build app.mek --target react` (SSR Ready)
- **Static:** `npx mekta build app.mek --target html` (High-Performance)
- **PHP:** `npx mekta build app.mek --target php` (Legacy/Bridge)

### 3. File-System Routing
Mekta maps your `pages/` directory directly to network endpoints:
- `pages/index.mek` → `/`
- `pages/blog/[id].mek` → `/blog/:id`
- `pages/blog/layout.mek` → Automatically wraps all blog posts.

---

## 🛠️ CLI Reference

| Command | Description |
|---------|-------------|
| `mekta ui` | Launch the Architect Core TUI Dashboard. |
| `mekta create <name>` | Scaffold a new project from high-fidelity presets. |
| `mekta dev` | Start the Express SSR server with hot-reload enabled. |
| `mekta build <file>` | Compile source to your choice of target architecture. |
| `mekta addons` | Manage plugins like GSAP and FiveM UI bridges. |
| `mekta bridge` | Explore inspiration from the Next.js template ecosystem. |

---

## 📖 Documentation
For more details, explore our full documentation site:
- [Getting Started](docs/getting-started.md)
- [Routing & Layouts](docs/routing.md)
- [.mek Syntax Guide](docs/syntax.md)
- [Addon System](docs/addons.md)

---

<div align="center">
  <sub>Built for the Architect Generation by the Mekta Team. ▣</sub>
</div>
