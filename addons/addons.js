/**
 * MektA Addon Engine and Plugin System
 */
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export class PluginHooks {
  constructor() {
    this.plugins = [];
  }

  use(plugin) {
    this.plugins.push(plugin);
  }

  applyBeforeLex(source, options) {
    let result = source;
    for (const p of this.plugins) {
      if (p.beforeLex) result = p.beforeLex(result, options) || result;
    }
    return result;
  }

  applyAfterParse(ast, options) {
    let result = ast;
    for (const p of this.plugins) {
      if (p.afterParse) result = p.afterParse(result, options) || result;
    }
    return result;
  }

  applyTransform(node, parent) {
    for (const p of this.plugins) {
      if (p.transformNode) p.transformNode(node, parent);
    }
  }
}

const builtInAddons = {
  gsap: {
    id: 'gsap',
    name: 'GSAP Animations',
    package: 'gsap',
    description: 'Adds GSAP animation capabilities for MektA UI components.',
    onInstall: (projectPath) => {
      const demoMek = `<page><heading>GSAP Animation Ready</heading></page>`;
      fs.writeFileSync(path.join(projectPath, 'gsap-demo.mek'), demoMek);
    }
  },
  tailwind: {
    id: 'tailwind',
    name: 'Tailwind CSS Bridge',
    package: 'tailwindcss',
    description: 'Configures Tailwind CSS compiler plugin for .mek styling.',
    onInstall: (projectPath) => {
      const config = `module.exports = { content: ["./pages/**/*.mek", "./components/**/*.mek"] };`;
      fs.writeFileSync(path.join(projectPath, 'tailwind.config.js'), config);
    }
  },
  fivem: {
    id: 'fivem',
    name: 'FiveM NUI UI Resource',
    package: 'fivem-ui-bridge',
    description: 'Configures project for GTA5 FiveM NUI UI resource export.',
    onInstall: (projectPath) => {
      const manifest = `fx_version 'cerulean'\ngame 'gta5'\nui_page 'html/index.html'`;
      fs.writeFileSync(path.join(projectPath, 'fxmanifest.lua'), manifest);
    }
  }
};

export function listAddons() {
  return Object.values(builtInAddons);
}

export function installAddon(addonId, projectPath = process.cwd()) {
  const addon = builtInAddons[addonId];
  if (!addon) throw new Error(`Addon ${addonId} not found.`);

  console.log(chalk.cyan(`[MektA Addons] Installing ${addon.name}...`));
  const pkgPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies[addon.package] = 'latest';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }
  if (addon.onInstall) addon.onInstall(projectPath);
  return true;
}
