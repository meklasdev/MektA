/**
 * Mekta Project Templates (v1.5 Architect)
 * Modern high-fidelity starters inspired by Next.js Ecosystem.
 */

const templates = {
  web: `
<page>
  <nav class="navbar">
    <text class="brand">Mekta Web</text>
    <links>
      <a href="/">Home</a>
      <a href="/docs">Docs</a>
    </links>
  </nav>
  <hero>
    <text class="h1">Build at the Speed of Light</text>
    <text class="p">Minimalist JSX-like syntax with maximalist SSR power.</text>
    <button color="primary">Get Started</button>
  </hero>
</page>
  `,
  dashboard: `
<layout>
  <sidebar>
    <text class="logo">M-Dashboard</text>
    <nav>
       <a href="/admin">Overview</a>
       <a href="/admin/users">Users</a>
       <a href="/admin/settings">Settings</a>
    </nav>
  </sidebar>
  <main-content>
     <header>Admin Panel</header>
     {children}
  </main-content>
</layout>
  `,
  ecommerce: `
<page>
  <grid cols="4">
    <m-for item="product in products">
       <card>
         <img src={product.image} />
         <text>{product.name}</text>
         <text class="price">{product.price}</text>
         <button>Add to Cart</button>
       </card>
    </m-for>
  </grid>
</page>
  `,
  landing: `
<page>
  <section class="hero-neon">
    <text class="title">Next.js Plus: Mekta</text>
    <text class="subtitle">The only framework optimized for AI-driven development.</text>
    <button class="cta">Deploy Now</button>
  </section>
  <section class="features">
    <card title="AST Compiled" />
    <card title="Multi-Target" />
    <card title="Instant SSR" />
  </section>
</page>
  `,
  fivem: `
<page>
  <overlay class="nui-container">
    <box class="hud">
      <text id="player-name">Player_01</text>
      <text id="balance">$1,000,000</text>
    </box>
    <box class="interaction">
      <text>[E] to interact</text>
    </box>
  </overlay>
</page>
  `
};

export function getTemplate(name) {
  return templates[name] || templates.web;
}

export function listTemplates() {
  return [
    { name: 'web', description: 'Standard SSR React-like project' },
    { name: 'dashboard', description: 'Admin panel with nested Layouts' },
    { name: 'ecommerce', description: 'Product grid with dynamic list' },
    { name: 'landing', description: 'High-fidelity SaaS landing page' },
    { name: 'fivem', description: 'FiveM NUI UI Resource' }
  ];
}

/**
 * Next.js Template Bridge Links
 */
export function getNextBridgeLinks() {
  return [
    { title: 'Vercel Dashboard Starter', url: 'https://vercel.com/templates/next.js/admin-dashboard-template' },
    { title: 'Commerce.js Boilerplate', url: 'https://vercel.com/templates/next.js/commerce' },
    { title: 'Taxonomy (Blog/Docs)', url: 'https://tx.shadcn.com/' },
    { title: 'Next.js SaaS Starter', url: 'https://github.com/steven-tey/precedent' }
  ];
}
