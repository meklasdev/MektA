import express from 'express';
import { renderToString } from 'react-dom/server';
import { compile } from '../core/compiler.js';
import { createElement } from '../runtime/runtime.js';
import { getTemplate } from '../templates/templates.js';
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
  const html = compile(mekCode, { target: 'html' });
  const php = compile(mekCode, { target: 'php' });

  const context = { createElement, React: { createElement }, ...params };
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
          <title>Mekta Framework - ${req.path}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 40px; }
            #root { background: #1a1a1a; padding: 40px; border-radius: 12px; border: 1px solid #8A2BE2; min-height: 200px; }
            ${css}
          </style>
        </head>
        <body>
          <div id="root">${ssrHtml}</div>
          <div style="margin-top: 50px; color: #555;">Route: ${route.file} | Params: ${JSON.stringify(route.params)}</div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(chalk.magenta(`Mekta server running at http://localhost:${PORT}`));
});
