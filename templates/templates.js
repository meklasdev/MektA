import fs from 'fs';
import path from 'path';

/**
 * Mekta Pre-built Presets (v1.5)
 */
const templates = {
  web: `
<page class="p-8 bg-slate-900 text-white min-h-screen">
  <header class="border-b border-slate-700 pb-4 mb-8">
    <text class="text-3xl font-bold">Mekta Web Application</text>
    <text class="text-slate-400">Architected for Agentic UI performance.</text>
  </header>
  <main>
    <container class="grid gap-4">
      <text m-if="user">Welcome back, {user.name}!</text>
      <text m-if="!user">Please authenticate to continue.</text>
      <button class="bg-violet-600 px-6 py-2 rounded-lg">Get Started</button>
    </container>
  </main>
</page>
`.trim(),

  fivem: `
<style>
  .neon-hud {
    position: fixed; top: 20px; right: 20px;
    background: rgba(10,10,15,0.9); border-left: 4px solid #7c3aed;
    padding: 20px; box-shadow: 0 0 20px rgba(124,58,237,0.3);
  }
  .hud-stat { color: #a78bfa; font-family: 'Inter', sans-serif; font-size: 14px; }
</style>
<page>
  <container class="neon-hud">
    <text class="hud-stat">CASH: $1,420,000</text>
    <text class="hud-stat">JOB: Cyber-Architect</text>
    <button class="mt-4 bg-violet-600 text-white px-4 py-1">MENU</button>
  </container>
</page>
`.trim(),

  landing: `
<page class="bg-black text-white selection:bg-violet-500">
  <hero class="text-center py-20 bg-gradient-to-b from-violet-900/20 to-black">
    <text class="text-6xl font-black tracking-tighter">MEKTA</text>
    <text class="text-xl text-slate-400 mt-4">The high-fidelity framework for the Agentic generation.</text>
    <button class="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold">Explore v1.5</button>
  </hero>
</page>
`.trim()
};

export function getTemplate(type) {
  return templates[type] || templates.web;
}
