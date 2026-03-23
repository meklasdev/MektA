#!/usr/bin/env node

import { Command } from 'commander';
import { startTUI } from './tui.js';
import fs from 'fs';
import path from 'path';
import { compile } from '../core/compiler.js';
import { getTemplate } from '../templates/templates.js';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import chalk from 'chalk';
import gradient from 'gradient-string';
import prompts from 'prompts';

const program = new Command();
const purpleGradient = gradient(['#8A2BE2', '#9370DB', '#E6E6FA']);

const ASCII_ART = `
  __  __   ______   _  __  _______   _
 |  \\/  | |  ____| | |/ / |__   __| | |
 | \\  / | | |__    | ' /     | |    | |
 | |\\/| | |  __|   |  <      | |    | |
 | |  | | | |____  | . \\     | |    | |____
 |_|  |_| |______| |_|\\_\\    |_|    |______|

`;

program
  .name('mekta')
  .description('Mekta Frontend Framework CLI')
  .version('1.2.0');

/**
 * CLI dashboard command
 */
program
  .command('dashboard')
  .description('Launch the Mekta TUI Dashboard')
  .action(() => {
    startTUI();
  });

/**
 * Interactive CLI create command
 */
program
  .command('create [name]')
  .description('Scaffold a new Mekta project interactively')
  .action(async (name) => {
    const response = await prompts([
      {
        type: name ? null : 'text',
        name: 'projectName',
        message: 'What is your project name?',
        initial: 'my-mekta-app'
      },
      {
        type: 'select',
        name: 'template',
        message: 'Pick a template',
        choices: [
          { title: 'Standard Web', value: 'web' },
          { title: 'FiveM UI (Mod)', value: 'fivem' },
          { title: 'Landing Page', value: 'landing' }
        ]
      },
      {
        type: 'select',
        name: 'target',
        message: 'Default build target?',
        choices: [
          { title: 'React (JS)', value: 'react' },
          { title: 'Static HTML', value: 'html' },
          { title: 'PHP Template', value: 'php' }
        ]
      }
    ]);

    const finalName = name || response.projectName;
    if (!finalName) return;

    const projectPath = path.resolve(finalName);
    if (fs.existsSync(projectPath)) {
      console.error(chalk.red(`Error: Directory ${finalName} already exists.`));
      process.exit(1);
    }

    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'src'));
    fs.writeFileSync(path.join(projectPath, 'src/app.mek'), getTemplate(response.template));
    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
      name: finalName,
      version: '1.0.0',
      type: 'module',
      scripts: {
        "build": `mekta build src/app.mek --target ${response.target}`,
        "dev": "mekta dev"
      },
      dependencies: { mekta: 'latest' }
    }, null, 2));

    console.log(chalk.green(`\nProject ${finalName} created successfully!`));
  });

/**
 * CLI build command
 */
program
  .command('build')
  .description('Build a .mek file into specified target (react, html, php)')
  .argument('<file>', 'The .mek file to build')
  .option('-t, --target <type>', 'The compilation target (react, html, php)', 'react')
  .action((file, options) => {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`Error: File ${file} not found.`));
      process.exit(1);
    }
    try {
      const source = fs.readFileSync(filePath, 'utf8');
      const { js, target } = compile(source, { target: options.target });
      const extension = target === 'react' ? '.js' : (target === 'php' ? '.php' : '.html');
      const outPath = filePath.replace('.mek', extension);
      fs.writeFileSync(outPath, js);
      console.log(chalk.green(`Successfully built ${file} for target: ${target}`));
    } catch (err) {
      console.error(chalk.red(`Build failed: ${err.message}`));
    }
  });

/**
 * CLI dev command
 */
program
  .command('dev')
  .description('Start the Mekta development server')
  .action(() => {
    const serverProcess = spawn('node', ['server/server.js'], { stdio: 'inherit' });
    const watcher = chokidar.watch(['core/**/*.js', 'server/**/*.js', '**/*.mek'], {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });
    watcher.on('change', (path) => {
      console.log(chalk.yellow(`\nFile ${path} changed. Restarting server...`));
      serverProcess.kill();
      process.exit(0);
    });
  });

if (process.argv.length <= 2) {
  console.log(purpleGradient(ASCII_ART));
  console.log(chalk.bold.magenta('  Mekta Framework - The Future of Agentic UI\n'));
  startTUI();
} else {
  program.parse();
}
