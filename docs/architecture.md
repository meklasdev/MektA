# MektA Architecture Overview

MektA is a complete frontend framework toolchain designed for AI-assisted development and multi-target compilation.

## Compiler Pipeline

```
.mek source
   ↓
Lexer (Tokens & Locations)
   ↓
Parser (AST Node Hierarchy)
   ↓
Semantic Analysis & Type Checking (TypeScript Compiler API)
   ↓
AST Transforms & Optimizations
   ↓
Target Code Generators (React/TSX, Static HTML)
```

## Core Modules

- **`core/parser.js`**: Lexer and Recursive Descent Parser with location tracking.
- **`core/ast/nodes.js`**: AST classes, Visitor API, and transformers.
- **`core/diagnostics.js`**: Diagnostic engine with visual code frame snippets.
- **`core/compiler.js`**: Pipeline orchestrator with caching and plugins.
- **`core/router.js`**: Recursive file-system router (`pages/`).
- **`core/ai.js`**: Project inspection API (`inspectProject`) and AI assistant.
