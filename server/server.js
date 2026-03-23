import express from 'express';
import { renderToString } from 'react-dom/server';
import { compile } from '../core/compiler.js';
import { createElement } from '../core/runtime.js';
import { getTemplate } from '../core/templates.js';
import vm from 'vm';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

/**
 * Enhanced AI generator that provides multiple targets
 */
function generateMek(prompt) {
  return `
<style>
  .ai-card { background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid #8A2BE2; }
  .ai-title { font-size: 1.5rem; color: #8A2BE2; font-weight: bold; }
</style>
<page>
  <container class="ai-card">
    <text class="ai-title">Mekta Multi-Target Output</text>
    <text>Generating UI for: ${prompt}</text>
    <button color="purple">Deploy to Cloud</button>
  </container>
</page>
`.trim();
}

/**
 * Enhanced multi-target rendering
 */
function renderMekAllTargets(mekCode) {
  const react = compile(mekCode, { target: 'react' });
  const html = compile(mekCode, { target: 'html' });
  const php = compile(mekCode, { target: 'php' });

  // Use VM to get the element for React SSR
  const context = { createElement, React: { createElement } };
  vm.createContext(context);
  const element = vm.runInContext(react.js, context);
  const ssrHtml = renderToString(element);

  return {
    ssrHtml,
    react: react.js,
    html: html.js,
    php: php.js,
    css: react.css
  };
}

app.get('/', (req, res) => {
  try {
    const landingPath = path.resolve('website/index.mek');
    const mekCode = fs.readFileSync(landingPath, 'utf8');
    const { ssrHtml, css } = renderMekAllTargets(mekCode);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mekta Framework - High-Fidelity Agentic UI</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
            ${css}
            .target-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 40px; }
            .code-box { background: #111; padding: 20px; border-radius: 10px; border: 1px solid #333; overflow: auto; max-height: 300px; }
            .code-box h4 { margin-top: 0; color: #8A2BE2; }
            pre { color: #9370DB; margin: 0; }
          </style>
        </head>
        <body>
          <div id="root">${ssrHtml}</div>
          <div style="padding: 40px; border-top: 1px solid #222;">
            <h2 style="color: #8A2BE2;">Framework Multi-Target Demo</h2>
            <div class="target-grid">
              <div class="code-box"><h4>React Output (JS)</h4><pre>${renderMekAllTargets(mekCode).react.replace(/</g, '&lt;')}</pre></div>
              <div class="code-box"><h4>PHP Output</h4><pre>${renderMekAllTargets(mekCode).php.replace(/</g, '&lt;')}</pre></div>
              <div class="code-box"><h4>Static HTML</h4><pre>${renderMekAllTargets(mekCode).html.replace(/</g, '&lt;')}</pre></div>
              <div class="code-box"><h4>Mekta Source</h4><pre>${mekCode.replace(/</g, '&lt;')}</pre></div>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).send({ error: 'Prompt is required' });

  try {
    const mekCode = generateMek(prompt);
    const { ssrHtml, react, html, php, css } = renderMekAllTargets(mekCode);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mekta AI - Multi-Target UI</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; padding: 40px; }
            .preview { background: #1a1a1a; padding: 40px; border-radius: 12px; border: 2px solid #8A2BE2; margin-bottom: 40px; }
            .code-tabs { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
            .tab { background: #111; padding: 20px; border-radius: 10px; border: 1px solid #333; }
            .tab h4 { margin-top: 0; color: #8A2BE2; }
            pre { color: #9370DB; white-space: pre-wrap; word-break: break-all; }
            ${css}
          </style>
        </head>
        <body>
          <h1 style="color: #8A2BE2;">Mekta AI Multi-Target Builder</h1>
          <div class="preview">${ssrHtml}</div>
          <div class="code-tabs">
            <div class="tab"><h4>React (.js)</h4><pre>${react}</pre></div>
            <div class="tab"><h4>HTML (.html)</h4><pre>${html.replace(/</g, '&lt;')}</pre></div>
            <div class="tab"><h4>PHP (.php)</h4><pre>${php.replace(/</g, '&lt;')}</pre></div>
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
  console.log(chalk.magenta(`Mekta server running at http://localhost:${PORT}`));
});
