import express from 'express';
import { renderToString } from 'react-dom/server';
import { compile } from '../core/compiler.js';
import { createElement } from '../runtime/runtime.js';
import { UI } from '../core/lib/ui.js';
import { Auth } from '../core/lib/auth.js';
import { DB } from '../core/lib/db.js';
import { Utils } from '../core/lib/utils.js';
import { resolveRoute } from '../core/router.js';
import vm from 'vm';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

/**
 * Enhanced multi-target rendering
 */
function renderMekAllTargets(mekCode, params = {}) {
  const { js, css } = compile(mekCode, { target: 'react' });

  const context = {
    createElement,
    React: { createElement },
    ...params,
    UI, Auth, DB, Utils
  };
  vm.createContext(context);
  const element = vm.runInContext(js, context);
  const ssrHtml = renderToString(element);

  return { ssrHtml, css };
}

// Catch-all route for file-system routing
app.get('*', (req, res) => {
  // Ignore favicon.ico
  if (req.path === '/favicon.ico') return res.status(204).end();

  const route = resolveRoute(req.path);
  if (!route) {
    return res.status(404).send(`
      <html>
        <head><title>404 - Not Found</title></head>
        <body style="font-family: sans-serif; background: #0a0a0a; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh;">
          <div style="text-align: center;">
            <h1 style="color: #ff00ff;">404</h1>
            <p>Page not found: ${req.path}</p>
            <a href="/" style="color: #00ffff;">Back Home</a>
          </div>
        </body>
      </html>
    `);
  }

  try {
    const mekCode = fs.readFileSync(route.file, 'utf8');
    const { ssrHtml, css } = renderMekAllTargets(mekCode, route.params);
    res.send(`
      <html>
        <head>
          <title>Mekta App</title>
          <style>${css}</style>
          <style>body { margin: 0; background: #0a0a0a; color: #fff; font-family: sans-serif; }</style>
        </head>
        <body>
          <div id="root">${ssrHtml}</div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(chalk.red(`Error rendering ${req.path}:`), err);
    res.status(500).send(`<pre>${err.stack}</pre>`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(chalk.magenta(`Mekta Architect server running at http://localhost:${PORT}`));
});
