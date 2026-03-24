# 🌌 Mekta: The Agentic UI Framework

<div align="center">
  <img src="mekta-logo.svg" width="200" alt="Mekta Logo" />
  <p><strong>High-Fidelity Agentic UI for the Next Generation</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blueviolet.svg)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/Version-1.2.0-purple.svg)]()
  [![Framework](https://img.shields.io/badge/Framework-React--Compatible-magenta.svg)]()
</div>

---

## ⚡ Overview

**Mekta** is a high-performance, modular frontend framework designed specifically for **Agentic AI** and high-fidelity terminal interfaces. It introduces the `.mek` file format— a JSX-like DSL that compiles directly into optimized React-compatible JavaScript.

Built with a "Purple Aesthetic" and a powerful TUI dashboard, Mekta is the ultimate tool for developers building AI-driven interfaces, **FiveM UI mods**, and professional landing pages.

---

## 🚀 Key Features

- 💜 **Interactive TUI Dashboard**: A command-center for your framework with built-in log monitoring and mode switching.
- 🧩 **Agentic DSL (.mek)**: A simplified, readable syntax for AI agents to generate structured UI.
- 🎨 **FiveM UI Native Support**: Specialized presets for game modders and high-fidelity UI components.
- 🛠️ **Addon System**: One-click integration for **GSAP Animations** and **Next.js Bridging**.
- 🚀 **Lightning Fast SSR**: Express-based server with built-in React Server Side Rendering.

---

## 🛠️ Quick Start

### 1. Installation
```bash
git clone https://github.com/your-username/mekta.git
cd mekta
npm install
```

### 2. Launch the Dashboard
Experience the framework through the interactive TUI:
```bash
node cli/index.js dashboard
```

### 3. Build a Component
Compile your `.mek` files to executable JavaScript:
```bash
node cli/index.js build examples/app.mek
```

### 4. Start the Dev Server
```bash
node cli/index.js dev
```

---

## 📖 Documentation

- [Getting Started](docs/getting-started.md)
- [.mek Syntax Guide](docs/syntax.md)
- [Addon System](docs/addons.md)
- [FiveM UI Integration](docs/fivem.md)

---

## 📂 Project Structure

| Directory | Purpose |
|-----------|---------|
| `core/`   | Parser, Compiler, and Addon Logic |
| `server/` | Express SSR & AI Generation API |
| `cli/`    | Ink-based TUI and Commander CLI |
| `docs/`   | Detailed framework documentation |
| `examples/`| Sample .mek files and presets |

---

<div align="center">
  <sub>Built with 💜 by the Mekta Team.</sub>
</div>
