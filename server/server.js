import express from 'express';
import { renderToString } from 'react-dom/server';
import { compile } from '../core/compiler.js';
import { createElement } from '../core/runtime.js';
import { getTemplate } from '../core/templates.js';
import vm from 'vm';
import chalk from 'chalk';

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

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({ error: 'Prompt is required' });
  }

  try {
    console.log(chalk.cyan(`[Mekta AI] Generating content for: ${prompt}`));
    const mekCode = generateMek(prompt);
    const jsCode = compile(mekCode);

    const context = { createElement, React: { createElement } };
    vm.createContext(context);
    const element = vm.runInContext(jsCode, context);
    const html = renderToString(element);

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
