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
 * Enhanced Mock AI function for generating .mek code using templates
 */
function generateMek(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes('fivem')) {
    return `
<style>
  .fivem-hud { position: fixed; top: 10%; right: 5%; color: white; background: rgba(0,0,0,0.8); padding: 10px; border-left: 5px solid #8A2BE2; }
  .fivem-btn { background: #8A2BE2; color: white; padding: 5px 10px; border: none; margin-top: 5px; }
</style>
<page>
  <!-- Generated HUD -->
  <container class="fivem-hud">
    <text weight="bold">CASH: $1,250,000</text>
    <text color="gray">JOB: Developer</text>
    <button class="fivem-btn">Toggle Menu</button>
  </container>
</page>
`.trim();
  }

  if (lower.includes('landing')) {
    return getTemplate('landing');
  }

  return `
<style>
  .ai-text { color: #8A2BE2; font-weight: bold; }
  .ai-btn { background: #9370DB; padding: 10px; border-radius: 5px; cursor: pointer; border: none; color: white; margin-top: 10px; }
  .ai-card { background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid #333; }
</style>
<page>
  <container class="ai-card">
    <text class="ai-text">Mekta AI: High-Fidelity UI Generator</text>
    <text>Prompt: ${prompt}</text>
    <button class="ai-btn">Deploy Component</button>
  </container>
</page>
`.trim();
}

/**
 * Helper to render .mek source to HTML string
 */
function renderMekToHtml(mekCode, title = "Mekta AI - Generated UI") {
  const { js, css } = compile(mekCode);
  const context = { createElement, React: { createElement } };
  vm.createContext(context);
  const element = vm.runInContext(js, context);
  const html = renderToString(element);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 20px; }
          #root { background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid #8A2BE2; min-height: 200px; }
          pre { background: #000; color: #9370DB; padding: 10px; border-radius: 5px; overflow: auto; border: 1px solid #333; }
          h3 { color: #8A2BE2; margin-top: 30px; }
          ${css}
        </style>
      </head>
      <body>
        <div id="root">${html}</div>
        <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
        <h3>Generated Source (.mek)</h3>
        <pre>${mekCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        <h3>Compiled JavaScript</h3>
        <pre>${js}</pre>
      </body>
    </html>
  `;
}

// Routes
app.get('/', (req, res) => {
  try {
    const landingPath = path.resolve('examples/landing-page.mek');
    const mekCode = fs.readFileSync(landingPath, 'utf8');
    res.send(renderMekToHtml(mekCode, "Mekta Framework"));
  } catch (err) {
    res.status(500).send({ error: `Failed to load landing page: ${err.message}` });
  }
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).send({ error: 'Prompt is required' });

  try {
    console.log(chalk.cyan(`[Mekta AI] Generating content for: ${prompt}`));
    const mekCode = generateMek(prompt);
    res.send(renderMekToHtml(mekCode));
  } catch (err) {
    console.error(chalk.red(`[Mekta Error] ${err.message}`));
    res.status(500).send({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(chalk.magenta(`Mekta server running at http://localhost:${PORT}`));
});
