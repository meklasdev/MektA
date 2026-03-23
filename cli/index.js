#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { compile } from '../core/compiler.js';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import ora from 'ora';
import prompts from 'prompts';
import { getTemplate } from '../core/templates.js';

const purpleGradient = gradient(['#8A2BE2', '#9370DB', '#E6E6FA']);
const program = new Command();

const ASCII_ART = `
  __  __   ______   _  __  _______   _
 |  \\/  | |  ____| | |/ / |__   __| | |
 | \\  / | | |__    | ' /     | |    | |
 | |\\/| | |  __|   |  <      | |    | |
 | |  | | | |____  | . \\     | |    | |____
 |_|  |_| |______| |_|\\_\\    |_|    |______|

`;

console.log(purpleGradient(ASCII_ART));
console.log(chalk.bold.magenta('  Mekta Framework - The Future of Agentic UI\n'));

program
  .name('mekta')
  .description('Mekta Frontend Framework CLI')
  .version('1.1.0');

/**
 * CLI newproject command
 */
program
  .command('newproject')
  .description('Create a new Mekta project from templates')
  .action(async () => {
    const response = await prompts([
      {
        type: 'text',
        name: 'name',
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
          { title: 'Landing Page (AI Optimized)', value: 'landing' }
        ]
      }
    ]);

    if (!response.name) return;

    const spinner = ora(`Scaffolding project ${chalk.cyan(response.name)}...`).start();

    const projectPath = path.resolve(response.name);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    const template = getTemplate(response.template);
    fs.writeFileSync(path.join(projectPath, 'app.mek'), template);

    spinner.succeed(chalk.green(`Project ${response.name} created successfully with ${response.template} template!`));
    console.log(boxen(`cd ${response.name}\nmekta dev`, { padding: 1, borderColor: 'magenta' }));
  });

/**
 * CLI build command
 */
program
  .command('build')
  .description('Build a .mek file into React-compatible JS')
  .argument('<file>', 'The .mek file to build')
  .action((file) => {
    const spinner = ora(`Building ${chalk.yellow(file)}...`).start();

    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      spinner.fail(`Error: File ${file} not found.`);
      process.exit(1);
    }

    try {
      const source = fs.readFileSync(filePath, 'utf8');
      const compiled = compile(source);

      const outPath = filePath.replace('.mek', '.js');
      fs.writeFileSync(outPath, compiled);
      spinner.succeed(chalk.green(`Successfully built ${file} → ${path.basename(outPath)}`));
    } catch (err) {
      spinner.fail(`Build failed: ${err.message}`);
    }
  });

/**
 * CLI dev command
 */
program
  .command('dev')
  .description('Start the Mekta development server')
  .action(() => {
    console.log(chalk.magenta('Starting Mekta dev server...'));
    const serverProcess = spawn('node', ['server/server.js'], { stdio: 'inherit' });

    const watcher = chokidar.watch(['core/**/*.js', 'server/**/*.js'], {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher.on('change', (path) => {
      console.log(chalk.yellow(`File ${path} changed. Restarting...`));
      serverProcess.kill();
      process.exit(0);
    });
  });

program.parse();
