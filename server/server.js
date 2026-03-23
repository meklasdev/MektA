import express from 'express';
import { renderToString } from 'react-dom/server';
import { compile } from '../core/compiler.js';
import { createElement } from '../core/runtime.js';
import vm from 'vm';

const app = express();
app.use(express.json());

/**
 * Mock AI function for generating .mek code
 */
function generateMek(prompt) {
  // Simple mock AI: wraps the prompt in <text> tags inside a <page>
  return `
<page>
  <text>AI Generated Content for: ${prompt}</text>
  <button color="blue">Click Here</button>
</page>
`.trim();
}

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({ error: 'Prompt is required' });
  }

  try {
    // 1. Generate .mek code from AI
    const mekCode = generateMek(prompt);

    // 2. Compile .mek → JS
    const jsCode = compile(mekCode);

    // 3. Execute JS code in context with runtime to get React element
    const context = { createElement, React: { createElement } };
    vm.createContext(context);
    const element = vm.runInContext(jsCode, context);

    // 4. Render to HTML
    const html = renderToString(element);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Mekta Generated Page</title></head>
        <body>
          <div id="root">${html}</div>
          <hr />
          <h3>Source (.mek)</h3>
          <pre>${mekCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          <h3>Compiled (JS)</h3>
          <pre>${jsCode}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Mekta server running at http://localhost:${PORT}`);
});
