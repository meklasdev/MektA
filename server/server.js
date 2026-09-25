import express from 'express';
import { renderToString } from 'react-dom/server';
import { compile } from '../core/compiler.js';
import { createElement, getHydrationScript } from '../runtime/runtime.js';
import { resolveRoute } from '../core/router.js';
import { loadConfig } from '../core/config.js';
import React from 'react';
import vm from 'vm';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const config = loadConfig(process.cwd());
const app = express();
app.use(express.json());

const clients = [];

/**
 * Server Sent Events (SSE) for HMR / live reload
 */
app.get('/__mekta_hmr', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  clients.push(res);
  req.on('close', () => {
    const idx = clients.indexOf(res);
    if (idx !== -1) clients.splice(idx, 1);
  });
});

export function notifyHMR(file) {
  for (const client of clients) {
    client.write(`data: ${JSON.stringify({ type: 'reload', file })}\n\n`);
  }
}

/**
 * Enhanced multi-target SSR rendering with CJS module evaluation
 */
function renderMekPage(routeInfo) {
  const pageMek = fs.readFileSync(routeInfo.file, 'utf8');
  let compiledPage = compile(pageMek, { filename: routeInfo.file, target: 'react', moduleFormat: 'cjs' });

  let pageCode = compiledPage.js;
  let css = compiledPage.css;

  // Layout wrapping if layouts exist
  if (routeInfo.layouts && routeInfo.layouts.length > 0) {
    for (const layoutPath of routeInfo.layouts) {
      const layoutMek = fs.readFileSync(layoutPath, 'utf8');
      const compiledLayout = compile(layoutMek, { filename: layoutPath, target: 'react', moduleFormat: 'cjs' });
      css += '\n' + compiledLayout.css;
    }
  }

  const moduleObj = { exports: {} };
  const context = {
    require: (mod) => {
      if (mod === 'react') return React;
      return {};
    },
    module: moduleObj,
    exports: moduleObj.exports,
    createElement,
    React: { createElement },
    params: routeInfo.params,
    console
  };

  vm.createContext(context);
  let ssrHtml = '';
  try {
    vm.runInContext(pageCode, context);
    const Component = moduleObj.exports;
    if (typeof Component === 'function') {
      ssrHtml = renderToString(createElement(Component, routeInfo.params));
    }
  } catch (err) {
    throw err;
  }

  return { ssrHtml, css };
}

// Visual Builder Addon Route
app.get('/builder', (req, res) => {
  const builderHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>MektA Vision Builder</title>
        <style>
          body { background: #020617; color: #fff; font-family: sans-serif; display: flex; height: 100vh; margin: 0; }
          .sidebar { width: 300px; background: #0f172a; border-right: 1px solid #334155; padding: 20px; }
          .canvas { flex: 1; display: flex; align-items: center; justify-content: center; background: #05050a; }
          .drop-zone { width: 80%; height: 80%; border: 2px dashed #8b5cf6; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
          .comp { padding: 10px; background: #1e293b; margin: 8px 0; cursor: move; border-radius: 4px; border: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="sidebar">
          <h3>▣ MEKTA VISION</h3>
          <p style="color: #64748b; font-size: 12px;">Visual Drag & Drop Engine</p>
          <div class="comp">Header</div>
          <div class="comp">Hero Section</div>
          <div class="comp">Card Grid</div>
          <div class="comp">Button Component</div>
        </div>
        <div class="canvas">
          <div class="drop-zone">Drag components here to architect your UI</div>
        </div>
      </body>
    </html>
  `;
  res.send(builderHtml);
});

// Catch-all route for file-system routing
app.get('*', (req, res) => {
  if (req.path === '/favicon.ico') return res.status(204).end();

  const routeInfo = resolveRoute(req.path);
  if (!routeInfo) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head><title>404 - MektA Not Found</title></head>
        <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="text-align: center; border: 1px solid #334155; padding: 2rem; border-radius: 0.5rem; background: #1e293b;">
            <h1 style="color: #6366f1; margin: 0;">404</h1>
            <p style="color: #94a3b8;">Resource not mapped: ${req.path}</p>
            <a href="/" style="color: #818cf8; text-decoration: none; border-bottom: 1px solid;">Return to Base</a>
          </div>
        </body>
      </html>
    `);
  }

  try {
    const startTime = Date.now();
    const { ssrHtml, css } = renderMekPage(routeInfo);
    const duration = Date.now() - startTime;

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MektA App</title>
          <style>${css}</style>
          <style>body { margin: 0; background: #0f172a; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }</style>
          ${getHydrationScript()}
          <script>
            const evtSource = new EventSource("/__mekta_hmr");
            evtSource.onmessage = (e) => {
              const data = JSON.parse(e.data);
              if (data.type === "reload") location.reload();
            };
          </script>
        </head>
        <body>
          <div id="root">${ssrHtml}</div>
          <!-- Rendered in ${duration}ms -->
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>MektA Compilation Error</title></head>
        <body style="background: #090d16; color: #ef4444; font-family: monospace; padding: 2rem;">
          <h2 style="color: #f87171;">✖ MektA Build Diagnostic</h2>
          <pre style="background: #1e1b4b; padding: 1.5rem; border-radius: 8px; border: 1px solid #3730a3; overflow-x: auto; color: #e0e7ff;">${err.message}</pre>
        </body>
      </html>
    `);
  }
});

const PORT = process.env.PORT || config.server.port || 3000;
app.listen(PORT, () => {
  console.log(chalk.magenta.bold('\nMektA Framework v1.6.0'));
  console.log(chalk.cyan('  ◉ Dev Server'));
  console.log(chalk.cyan('  ◉ Compiler & AST'));
  console.log(chalk.cyan('  ◉ Server-Side Hydration'));
  console.log(chalk.cyan('  ◉ TypeScript Type System\n'));
  console.log(chalk.green(` Local: http://localhost:${PORT}`));
  console.log(chalk.gray(' ✓ Ready for development\n'));
});
