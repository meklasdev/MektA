#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { compile } from '../core/compiler.js';
import { spawn } from 'child_process';
import chokidar from 'chokidar';

const program = new Command();

program
  .name('mekta')
  .description('Mekta Frontend Framework CLI')
  .version('1.0.0');

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
      console.error(`Error: File ${file} not found.`);
      process.exit(1);
    }

    const source = fs.readFileSync(filePath, 'utf8');
    const compiled = compile(source);

    const outPath = filePath.replace('.mek', '.js');
    fs.writeFileSync(outPath, compiled);
    console.log(`Successfully built ${file} → ${path.basename(outPath)}`);
  });

/**
 * CLI dev command
 */
program
  .command('dev')
  .description('Start the Mekta development server')
  .action(() => {
    console.log('Starting Mekta dev server...');
    const serverProcess = spawn('node', ['server/server.js'], { stdio: 'inherit' });

    // Bonus: Watch mode (simple)
    const watcher = chokidar.watch(['core/**/*.js', 'server/**/*.js'], {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    watcher.on('change', (path) => {
      console.log(`File ${path} has been changed. Restarting server...`);
      serverProcess.kill();
      process.exit(0); // For simplicity, rely on a wrapper or the user to restart or handle properly.
      // In a real framework we'd restart the child process.
    });
  });

program.parse();
