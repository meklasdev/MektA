#!/usr/bin/env node

import { Command } from 'commander';
import { startTUI } from './tui.js';
import fs from 'fs';
import path from 'path';
import { compile } from '../core/compiler.js';
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
 * CLI dashboard command (Starts the TUI)
 */
program
  .command('dashboard')
  .description('Launch the Mekta TUI Dashboard')
  .action(() => {
    startTUI();
  });

/**
 * CLI build command
 */
program
  .command('build')
  .description('Build a .mek file into React-compatible JS')
  .argument('<file>', 'The .mek file to build')
  .action((file) => {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`Error: File ${file} not found.`));
      process.exit(1);
    }
    const source = fs.readFileSync(filePath, 'utf8');
    const compiled = compile(source);
    const outPath = filePath.replace('.mek', '.js');
    fs.writeFileSync(outPath, compiled);
    console.log(chalk.green(`Successfully built ${file} → ${path.basename(outPath)}`));
  });

/**
 * CLI dev command (with auto-restart)
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

    const watcher = chokidar.watch(['core/**/*.js', 'server/**/*.js'], {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher.on('change', (path) => {
      console.log(chalk.yellow(`\nFile ${path} changed. Restarting server...`));
      startServer();
    });

    // Handle process termination
    process.on('SIGINT', () => {
      if (serverProcess) serverProcess.kill();
      process.exit(0);
    });
  });

// If no args, show logo and dashboard
if (process.argv.length <= 2) {
  console.log(purpleGradient(ASCII_ART));
  console.log(chalk.bold.magenta('  Mekta Framework - The Future of Agentic UI\n'));
  startTUI();
} else {
  program.parse();
}
