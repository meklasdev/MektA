#!/usr/bin/env node

/**
 * Mekta CLI Entry Point (v1.5 Architect Edition)
 */

import { Command } from 'commander';
import { startTUI } from './tui.js';
import fs from 'fs';
import path from 'path';
import { compile } from '../core/compiler.js';
import { getTemplate } from '../templates/templates.js';
import { listAddons, installAddon } from '../addons/addons.js';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import chalk from 'chalk';
import prompts from 'prompts';

const program = new Command();

program
  .name('mekta')
  .description('Mekta Frontend Framework CLI - Architect Edition')
  .version('1.5.0');

/**
 * Launch Dashboard (TUI)
 */
program
  .command('dashboard')
  .alias('ui')
  .description('Launch the high-fidelity Mekta TUI Dashboard')
  .action(() => {
    startTUI();
  });

/**
 * Interactive Create Command
 */
program
  .command('create [name]')
  .description('Scaffold a new Mekta project interactively')
  .action(async (name) => {
    const response = await prompts([
      {
        type: name ? null : 'text',
        name: 'projectName',
        message: 'Project Name:',
        initial: 'my-mekta-app'
      },
      {
        type: 'select',
        name: 'template',
        message: 'Architecture Preset:',
        choices: [
          { title: 'Standard Web (React SSR)', value: 'web' },
          { title: 'FiveM UI (Neon Mod)', value: 'fivem' },
          { title: 'AI Landing Page', value: 'landing' }
        ]
      }
    ]);

    const finalName = name || response.projectName;
    if (!finalName) return;

    const projectPath = path.resolve(finalName);
    if (fs.existsSync(projectPath)) {
      console.error(chalk.red(`Error: Path ${finalName} already exists.`));
      process.exit(1);
    }

    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'pages'));
    fs.writeFileSync(path.join(projectPath, 'pages/index.mek'), getTemplate(response.template));
    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
      name: finalName,
      version: '1.0.0',
      type: 'module',
      scripts: {
        "build": "mekta build pages/index.mek",
        "dev": "mekta dev"
      },
      dependencies: { "mekta": "latest" }
    }, null, 2));

    console.log(chalk.magenta(`\n◆ Project ${finalName} architected successfully!`));
    console.log(chalk.gray(`  cd ${finalName}\n  npx mekta dashboard`));
  });

/**
 * Build Command
 */
program
  .command('build')
  .description('Compile .mek into React/HTML/PHP targets')
  .argument('<file>', 'Source .mek file')
  .option('-t, --target <type>', 'Target output (react|html|php)', 'react')
  .action((file, options) => {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`Error: File ${file} not found.`));
      process.exit(1);
    }
    try {
      const source = fs.readFileSync(filePath, 'utf8');
      const { js, target } = compile(source, { target: options.target });
      const ext = target === 'react' ? '.js' : (target === 'php' ? '.php' : '.html');
      fs.writeFileSync(filePath.replace('.mek', ext), js);
      console.log(chalk.cyan(`✔ Compiled ${path.basename(file)} to ${target.toUpperCase()}`));
    } catch (err) {
      console.error(chalk.red(`Build Failure: ${err.message}`));
    }
  });

/**
 * Addons Command
 */
program
  .command('addons')
  .description('Manage Mekta addons (GSAP, FiveM, etc.)')
  .argument('[id]', 'Addon ID to install')
  .option('-l, --list', 'List all available addons')
  .action((id, options) => {
    if (options.list || !id) {
      console.log(chalk.magenta('\n◆ Available Mekta Addons:'));
      listAddons().forEach(a => console.log(chalk.cyan(`  - ${a.id}:`), chalk.gray(a.description)));
      return;
    }

    const success = installAddon(id, process.cwd());
    if (success) {
      console.log(chalk.green(`✔ Addon '${id}' installed successfully!`));
    }
  });

/**
 * Dev Server Command
 */
program
  .command('dev')
  .description('Start dev server with Hot Reload')
  .action(() => {
    console.log(chalk.magenta('◆ Initializing Hot Reload server...'));

    let server;
    const startServer = () => {
      if (server) server.kill();
      server = spawn('node', ['server/server.js'], { stdio: 'inherit' });
    };

    startServer();

    chokidar.watch(['core/**/*.js', 'server/**/*.js', 'pages/**/*.mek']).on('change', (p) => {
      console.log(chalk.yellow(`\n♻ File ${p} changed. Re-architecting...`));
      startServer();
    });
  });

// Default behavior: Launch TUI if no args
if (process.argv.length <= 2) {
  startTUI();
} else {
  program.parse();
}
