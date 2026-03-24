# 🌌 Mekta: The Architect Core Framework

<div align="center">
  <img src="mekta-logo.svg" width="200" alt="Mekta Logo" />
  <p><strong>High-Fidelity Virtual UI for the Next Generation</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blueviolet.svg)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/Version-1.6.0-indigo.svg)]()
  [![Framework](https://img.shields.io/badge/Framework-React--Compatible-blue.svg)]()
</div>

---

## ⚡ Overview

**Mekta** is a high-performance, modular frontend framework designed for **Architectural UI** and high-fidelity terminal interfaces. It introduces the `.mek` file format— a JSX-like DSL that compiles into optimized React-compatible JavaScript, Static HTML, or PHP.

Built with a professional "Architect Core" TUI dashboard, Mekta is the ultimate tool for developers building structured interfaces, **Next.js-style apps**, and **FiveM UI resources**.

---

## 🚀 Key Features

- ▣ **Architect Core Dashboard**: A professional slate-themed TUI command-center with live file-tree and route mapping.
- 📐 **Next.js Plus Routing**: File-system based routing with support for nested layouts (`layout.mek`) and dynamic paths.
- 🧩 **Flexible DSL (.mek)**: A robust, readable syntax supporting Fragments, Expressions, and Component detection.
- 🛠️ **Addon System**: Built-in support for **GSAP Animations** and **FiveM Bridge** scaffolding.
- 🚀 **Stable Multi-Target Compiler**: Compile `.mek` directly to React, static HTML, or PHP with intelligent tag mapping.

---

## 🛠️ Quick Start

### 1. Installation
```bash
git clone https://github.com/mekta/mekta.git
cd mekta
npm install
```

### 2. Launch the Architect Dashboard
Experience the framework through the professional TUI:
```bash
npx mekta dashboard
```

### 3. Build a Project
Create a new project from a high-fidelity template:
```bash
npx mekta create my-app
```

### 4. Start the Dev Server
```bash
npx mekta dev
```

---

## 📖 Documentation

- [Getting Started](docs/getting-started.md)
- [Routing & Layouts](docs/routing.md)
- [.mek Syntax Guide](docs/syntax.md)
- [Addon System](docs/addons.md)

---

## 📂 Project Structure

| Directory | Purpose |
|-----------|---------|
| `core/`   | Parser, Multi-Target Compiler, Router |
| `server/` | Express SSR & Multi-Target Engine |
| `cli/`    | Ink-based Architect Dashboard & CLI |
| `docs/`   | Detailed framework documentation |
| `templates/`| High-fidelity presets (Dashboard, SaaS, etc.) |

---

<div align="center">
  <sub>Built with ▣ by the Mekta Team.</sub>
</div>
