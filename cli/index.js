#!/usr/bin/env node

import { Command } from 'commander';
import { startTUI } from './tui.js';
import fs from 'fs';
import path from 'path';
import { compile } from '../core/compiler.js';
import { getTemplate } from '../core/templates.js';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import chalk from 'chalk';
import gradient from 'gradient-string';

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
 * CLI create command
 */
program
  .command('create <name>')
  .description('Scaffold a new Mekta project')
  .action((name) => {
    const projectPath = path.resolve(name);
    if (fs.existsSync(projectPath)) {
      console.error(chalk.red(`Error: Directory ${name} already exists.`));
      process.exit(1);
    }

    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'src'));
    fs.writeFileSync(path.join(projectPath, 'src/app.mek'), getTemplate('web'));
    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
      name,
      version: '1.0.0',
      type: 'module',
      dependencies: { mekta: 'latest' }
    }, null, 2));

    console.log(chalk.green(`Project ${name} created successfully!`));
    console.log(chalk.magenta(`  cd ${name}\n  mekta dev`));
  });

/**
 * CLI build command
 */
program
  .command('build')
  .description('Build a .mek file into React-compatible JS/CSS')
  .argument('<file>', 'The .mek file to build')
  .action((file) => {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`Error: File ${file} not found.`));
      process.exit(1);
    }
    try {
      const source = fs.readFileSync(filePath, 'utf8');
      const { js, css } = compile(source);

      const outPathJS = filePath.replace('.mek', '.js');
      const outPathCSS = filePath.replace('.mek', '.css');

      fs.writeFileSync(outPathJS, js);
      if (css) fs.writeFileSync(outPathCSS, css);

      console.log(chalk.green(`Successfully built ${file}`));
      console.log(chalk.cyan(`  - ${path.basename(outPathJS)}`));
      if (css) console.log(chalk.cyan(`  - ${path.basename(outPathCSS)}`));
    } catch (err) {
      console.error(chalk.red(`Build failed: ${err.message}`));
    }
  });

/**
 * CLI dev command
 */
program
  .command('dev')
  .description('Start the Mekta development server with watch mode')
  .action(() => {
    console.log(chalk.magenta('Starting Mekta dev server...'));
    let serverProcess = null;
    const startServer = () => {
      if (serverProcess) serverProcess.kill();
      serverProcess = spawn('node', ['server/server.js'], { stdio: 'inherit' });
    };
    startServer();
    const watcher = chokidar.watch(['core/**/*.js', 'server/**/*.js', '**/*.mek'], {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });
    watcher.on('change', (path) => {
      console.log(chalk.yellow(`\nFile ${path} changed. Restarting server...`));
      startServer();
    });
    process.on('SIGINT', () => {
      if (serverProcess) serverProcess.kill();
      process.exit(0);
    });
  });

// Default behavior
if (process.argv.length <= 2) {
  console.log(purpleGradient(ASCII_ART));
  console.log(chalk.bold.magenta('  Mekta Framework - The Future of Agentic UI\n'));
  startTUI();
} else {
  program.parse();
}
