import express from 'express';
import { renderToString } from 'react-dom/server';
import { compile } from '../core/compiler.js';
import { createElement } from '../runtime/runtime.js';
import { getTemplate } from '../templates/templates.js';
import { resolveRoute } from '../core/router.js';
import { UI } from '../core/lib/ui.js';
import { Auth } from '../core/lib/auth.js';
import { DB } from '../core/lib/db.js';
import { Utils } from '../core/lib/utils.js';
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
  const html = compile(mekCode, { target: 'html' });
  const php = compile(mekCode, { target: 'php' });

  const context = {
    createElement,
    React: { createElement },
    ...params,
    UI, Auth, DB, Utils
  };
  vm.createContext(context);
  const element = vm.runInContext(js, context);
  const ssrHtml = renderToString(element);

  return { ssrHtml, react: js, html: html.js, php: php.js, css };
}

// Routes
app.get('*', (req, res) => {
  const route = resolveRoute(req.path);
  if (!route) return res.status(404).send('404: Not Found');

  try {
    const mekCode = fs.readFileSync(route.file, 'utf8');
    const { ssrHtml, css } = renderMekAllTargets(mekCode, route.params);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mekta Architect - ${req.path}</title>
          <style>
            body { font-family: 'Inter', 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 40px; }
            #root { background: #111; padding: 40px; border-radius: 12px; border: 1px solid #8A2BE2; min-height: 200px; }
            ${css}
            .system-info { margin-top: 50px; color: #555; font-size: 0.8rem; font-family: monospace; }
          </style>
        </head>
        <body>
          <div id="root">${ssrHtml}</div>
          <div class="system-info">
            Route: ${route.file} | Params: ${JSON.stringify(route.params)}<br/>
            Framework: Mekta V1.2.0 (Architect Edition)
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(chalk.magenta(`Mekta Architect server running at http://localhost:${PORT}`));
});
