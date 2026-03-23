/**
 * Mekta Addon System
 */
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const addons = {
  gsap: {
    id: 'gsap',
    name: 'GSAP Animations',
    package: 'gsap',
    description: 'Adds GSAP for high-performance animations in Mekta components.',
    onInstall: (projectPath) => {
      const demoMek = `<page><text id="hero">Animate me!</text></page>`;
      fs.writeFileSync(path.join(projectPath, 'gsap-demo.mek'), demoMek);
    }
  },
  fivem: {
    id: 'fivem',
    name: 'FiveM Resource',
    package: 'fivem-ui-bridge',
    description: 'Configures your project for use as a FiveM UI resource.',
    onInstall: (projectPath) => {
      // Generate FiveM specific files
      const manifest = `fx_version 'cerulean'\ngame 'gta5'\nui_page 'html/index.html'\nfiles {\n  'html/index.html',\n  'html/style.css',\n  'html/script.js'\n}`;
      fs.writeFileSync(path.join(projectPath, 'fxmanifest.lua'), manifest);
      if (!fs.existsSync(path.join(projectPath, 'html'))) {
        fs.mkdirSync(path.join(projectPath, 'html'));
      }
    }
  }
};

export function listAddons() { return Object.values(addons); }

export function installAddon(addonId, projectPath) {
  const addon = addons[addonId];
  if (!addon) throw new Error(`Addon ${addonId} not found.`);

  console.log(chalk.cyan(`[Mekta Addons] Installing ${addon.name}...`));
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies[addon.package] = 'latest';
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }
    if (addon.onInstall) addon.onInstall(projectPath);
    return true;
  } catch (err) {
    console.error(chalk.red(`Failed to install addon: ${err.message}`));
    return false;
  }
}
