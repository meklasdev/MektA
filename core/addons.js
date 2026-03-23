/**
 * Mekta Addon System
 * Allows extending the framework with GSAP, Next.js templates, etc.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

const addons = {
  gsap: {
    name: 'GSAP Animations',
    package: 'gsap',
    description: 'Adds GSAP for high-performance animations in Mekta components.',
    inject: (source) => {
      return `import { gsap } from 'gsap';\n${source}`;
    }
  },
  nextjs: {
    name: 'Next.js Bridge',
    package: 'next',
    description: 'Experimental bridge to render .mek inside Next.js pages.',
    inject: (source) => source // Placeholder
  }
};

export function listAddons() {
  return Object.keys(addons).map(key => ({
    id: key,
    ...addons[key]
  }));
}

export function installAddon(addonId, projectPath) {
  const addon = addons[addonId];
  if (!addon) throw new Error(`Addon ${addonId} not found.`);

  console.log(chalk.cyan(`[Mekta Addons] Installing ${addon.name}...`));

  try {
    // Mock installation by adding to package.json if it exists
    const pkgPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies[addon.package] = 'latest';
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      console.log(chalk.green(`Successfully added ${addon.package} to dependencies.`));
    }
    return true;
  } catch (err) {
    console.error(chalk.red(`Failed to install addon: ${err.message}`));
    return false;
  }
}
