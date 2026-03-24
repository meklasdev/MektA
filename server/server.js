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
 * Enhanced multi-target rendering with Layout support
 */
function renderMekChain(pageCode, layoutChain = [], params = {}) {
  // Wrap page in layouts recursively
  let finalMek = pageCode;

  for (let i = layoutChain.length - 1; i >= 0; i--) {
     const layoutCode = fs.readFileSync(layoutChain[i], 'utf8');
     // Inject content into {children} placeholder in layout
     finalMek = layoutCode.replace('{children}', finalMek);
  }

  const { js, css } = compile(finalMek, { target: 'react' });

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

// Routes - Catch-all for file-system routing
app.get('*', (req, res) => {
  if (req.path === '/favicon.ico') return res.status(204).end();

  const route = resolveRoute(req.path);
  if (!route) {
    return res.status(404).send(`
      <html>
        <head><title>404 - Not Found</title></head>
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
    const mekCode = fs.readFileSync(route.file, 'utf8');
    const { ssrHtml, css } = renderMekChain(mekCode, route.layouts, route.params);
    res.send(`
      <html>
        <head>
          <title>Mekta Architect</title>
          <style>${css}</style>
          <style>body { margin: 0; background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }</style>
        </head>
        <body>
          <div id="root">${ssrHtml}</div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`<pre>${err.stack}</pre>`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(chalk.cyan(`[Mekta] Server online at http://localhost:${PORT}`));
});
