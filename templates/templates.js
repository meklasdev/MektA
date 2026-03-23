/**
 * Mekta Project Templates
 */
const templates = {
  web: `
<page>
  <header>
    <text>Mekta Web Project</text>
  </header>
  <main>
    <text>Welcome to your new Mekta web application!</text>
  </main>
</page>
`.trim(),

  fivem: `
<page class="fivem-ui">
  <container id="hud">
    <text class="money">$100,000</text>
    <text class="job">Police Officer</text>
    <button color="purple">Action Menu</button>
  </container>
</page>
`.trim(),

  landing: `
<page>
  <hero>
    <text size="large">The Future of AI is Mekta</text>
    <button color="magenta">Get Started</button>
  </hero>
  <features>
    <text>Fast, Modular, AI-First</text>
  </features>
</page>
`.trim()
};

export function getTemplate(type) {
  return templates[type] || templates.web;
}
