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
  // If prompt mentions fivem or web, return those templates
  const lower = prompt.toLowerCase();
  if (lower.includes('fivem')) return getTemplate('fivem');
  if (lower.includes('landing')) return getTemplate('landing');

  // Default mock AI: wraps the prompt
  return `
<page>
  <text>AI Agent Output: ${prompt}</text>
  <button color="purple">Interact with AI</button>
</page>
`.trim();
}

/**
 * Helper to render .mek source to HTML string
 */
function renderMekToHtml(mekCode) {
  const jsCode = compile(mekCode);
  const context = { createElement, React: { createElement } };
  vm.createContext(context);
  const element = vm.runInContext(jsCode, context);
  return { html: renderToString(element), jsCode };
}

// Default Landing Page Route
app.get('/', (req, res) => {
  try {
    const landingPath = path.resolve('examples/landing-page.mek');
    const mekCode = fs.readFileSync(landingPath, 'utf8');
    const { html, jsCode } = renderMekToHtml(mekCode);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mekta Framework - The Future of Agentic UI</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
            .hero { padding: 80px 40px; text-align: center; background: linear-gradient(135deg, #1a0a2a, #0a0a0a); border-bottom: 2px solid #8A2BE2; }
            .hero h1 { font-size: 4rem; margin: 0; color: #8A2BE2; }
            .hero p { font-size: 1.5rem; color: #9370DB; }
            .features { display: flex; gap: 20px; padding: 40px; justify-content: center; }
            .feature-card { background: #1a1a1a; padding: 25px; border-radius: 12px; border: 1px solid #444; width: 300px; transition: transform 0.3s; }
            .feature-card:hover { transform: translateY(-5px); border-color: #8A2BE2; }
            .feature-card h3 { color: #8A2BE2; margin-top: 0; }
            .feature-card p { color: #ccc; line-height: 1.6; }
            button { background: #8A2BE2; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 1.1rem; font-weight: bold; }
            footer { text-align: center; padding: 40px; color: #666; font-size: 0.9rem; }
            header { padding: 20px 40px; background: #0a0a0a; display: flex; justify-content: space-between; align-items: center; }
            .logo { color: #8A2BE2; font-weight: bold; font-size: 1.5rem; }
          </style>
        </head>
        <body>
          <header>
            <div class="logo">MEKTA // V1.2.0</div>
            <nav><a href="/docs" style="color: #9370DB; text-decoration: none;">Docs</a></nav>
          </header>

          <div class="hero">
            <h1>MEKTA</h1>
            <p>High-Fidelity Agentic UI Framework</p>
            <button>Discover the DSL</button>
          </div>

          <div class="features">
            <div class="feature-card">
              <h3>Agentic DSL (.mek)</h3>
              <p>A simplified, readable syntax for AI agents and high-fidelity interfaces.</p>
            </div>
            <div class="feature-card">
              <h3>TUI Dashboard</h3>
              <p>Professional terminal interfaces built for modern developers.</p>
            </div>
            <div class="feature-card">
              <h3>FiveM UI Native</h3>
              <p>Specialized tools for the next generation of game modders.</p>
            </div>
          </div>

          <hr style="border: 0; border-top: 1px solid #222; margin: 40px 0;" />

          <div style="padding: 0 40px;">
            <h2 style="color: #8A2BE2;">SSR Engine Output</h2>
            <div id="root" style="background: #111; padding: 40px; border-radius: 12px; border: 1px solid #333;">${html}</div>
          </div>

          <footer>© 2024 Mekta Team. Built for the Next Generation.</footer>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send({ error: `Failed to load landing page: ${err.message}` });
  }
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({ error: 'Prompt is required' });
  }

  try {
    console.log(chalk.cyan(`[Mekta AI] Generating content for: ${prompt}`));
    const mekCode = generateMek(prompt);
    const { html, jsCode } = renderMekToHtml(mekCode);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mekta AI - Generated UI</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; background: #1a1a1a; color: #fff; padding: 2rem; }
            #root { background: #2d2d2d; padding: 20px; border-radius: 8px; border: 1px solid #8A2BE2; }
            pre { background: #000; color: #9370DB; padding: 10px; border-radius: 5px; overflow: auto; }
            h3 { color: #8A2BE2; }
            button { background: #8A2BE2; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h1 style="color: #8A2BE2;">Mekta AI Builder</h1>
          <div id="root">${html}</div>
          <hr style="border-color: #444;" />
          <h3>Source (.mek)</h3>
          <pre>${mekCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          <h3>Compiled (JS)</h3>
          <pre>${jsCode}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(chalk.red(`[Mekta Error] ${err.message}`));
    res.status(500).send({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(chalk.magenta(`Mekta server running at http://localhost:${PORT}`));
});
