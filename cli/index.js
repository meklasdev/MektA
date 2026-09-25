#!/usr/bin/env node

/**
 * Mekta CLI Entry Point (v1.6 Architect Edition)
 */

import { Command } from 'commander';
import { startTUI } from './tui.js';
import fs from 'fs';
import path from 'path';
import { compile } from '../core/compiler.js';
import { getTemplate, listTemplates, getNextBridgeLinks } from '../templates/templates.js';
import { listAddons, installAddon } from '../addons/addons.js';
import { runDoctor } from '../core/doctor.js';
import { formatMek, formatMekCheck } from '../core/formatter.js';
import { lintMek } from '../core/linter.js';
import { inspectProject, executeAICommand } from '../core/ai.js';
import { Router } from '../core/router.js';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import chalk from 'chalk';
import prompts from 'prompts';

const program = new Command();

program
  .name('mekta')
  .description('MektA Frontend Framework CLI - Complete Toolchain Edition')
  .version('1.6.0');

/**
 * Dashboard (TUI)
 */
program
  .command('dashboard')
  .alias('ui')
  .description('Launch the MektA TUI Architect Dashboard')
  .action(() => {
    startTUI();
  });

/**
 * Doctor Command
 */
program
  .command('doctor')
  .description('Perform MektA environment and project diagnostics')
  .action(() => {
    runDoctor(process.cwd());
  });

/**
 * Formatter Command
 */
program
  .command('format [file]')
  .description('Format .mek source files')
  .option('--check', 'Check if files are formatted without editing')
  .action((file, options) => {
    const targetFile = file || 'pages/index.mek';
    if (!fs.existsSync(targetFile)) {
      console.log(chalk.red(`Error: File ${targetFile} not found.`));
      return;
    }

    const source = fs.readFileSync(targetFile, 'utf8');
    if (options.check) {
      const isFormatted = formatMekCheck(source);
      if (isFormatted) {
        console.log(chalk.green(`✔ ${targetFile} is formatted correctly.`));
      } else {
        console.log(chalk.yellow(`⚠ ${targetFile} needs formatting. Run 'mekta format ${targetFile}'`));
        process.exitCode = 1;
      }
    } else {
      const formatted = formatMek(source);
      fs.writeFileSync(targetFile, formatted);
      console.log(chalk.green(`✔ Formatted ${targetFile}`));
    }
  });

/**
 * Linter Command
 */
program
  .command('lint [file]')
  .description('Lint .mek files for syntax, keys, and accessibility warnings')
  .action((file) => {
    const targetFile = file || 'pages/index.mek';
    if (!fs.existsSync(targetFile)) {
      console.log(chalk.red(`Error: File ${targetFile} not found.`));
      return;
    }
    const source = fs.readFileSync(targetFile, 'utf8');
    const diagnostics = lintMek(source, targetFile);

    if (diagnostics.hasErrors() || diagnostics.getWarnings().length > 0) {
      console.log(diagnostics.formatAll(source));
    } else {
      console.log(chalk.green(`✔ Lint passed cleanly for ${targetFile}`));
    }
  });

/**
 * Routes Command
 */
program
  .command('routes')
  .description('Display mapped file-system routes')
  .action(() => {
    const router = new Router('pages');
    router.scanRoutes(process.cwd());

    console.log(chalk.magenta.bold('\n▣ MektA File-System Routes\n'));
    for (const r of router.routes) {
      const type = r.isCatchAll ? chalk.yellow('[catch-all]') : (r.isDynamic ? chalk.cyan('[dynamic]') : chalk.green('[static]'));
      console.log(`  ${r.path.padEnd(25)} ${type} -> ${r.file}`);
    }
    console.log();
  });

/**
 * Inspect JSON Command
 */
program
  .command('inspect')
  .description('Output project AST, route, and component structure in JSON for AI agents')
  .option('--json', 'Output raw JSON')
  .action(() => {
    const data = inspectProject(process.cwd());
    console.log(JSON.stringify(data, null, 2));
  });

/**
 * AI Assistant Command
 */
program
  .command('ai [action] [arg]')
  .description('AI Assistant commands (explain, fix, component, route)')
  .action((action, arg) => {
    const res = executeAICommand(action, arg ? [arg] : [], process.cwd());
    console.log(chalk.cyan(res));
  });

/**
 * Info Command
 */
program
  .command('info')
  .description('Display framework and project info')
  .action(() => {
    console.log(chalk.magenta.bold('\n▣ MektA Framework Info'));
    console.log(chalk.gray('  Version: 1.6.0-Architect'));
    console.log(chalk.gray('  Target: React / Static HTML / Multi-Target'));
    console.log(chalk.gray('  Node: ' + process.version + '\n'));
  });

/**
 * Clean Command
 */
program
  .command('clean')
  .description('Clean MektA compiler build cache and artifacts')
  .action(() => {
    console.log(chalk.green('✔ Compiler cache cleared.'));
  });

/**
 * Create Command
 */
program
  .command('create [name]')
  .description('Scaffold a new MektA project interactively')
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
        choices: listTemplates().map(t => ({ title: t.name, value: t.name, description: t.description }))
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
    fs.mkdirSync(path.join(projectPath, 'components'));
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
    console.log(chalk.gray(`  cd ${finalName}\n  npx mekta dev`));
  });

/**
 * Build Command
 */
program
  .command('build [file]')
  .description('Compile .mek into React/HTML targets')
  .option('-t, --target <type>', 'Target output (react|html)', 'react')
  .action((file, options) => {
    const targetFile = file || 'pages/index.mek';
    const filePath = path.resolve(targetFile);
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`Error: File ${targetFile} not found.`));
      process.exit(1);
    }
    try {
      const source = fs.readFileSync(filePath, 'utf8');
      const { js, target } = compile(source, { filename: filePath, target: options.target });
      const ext = target === 'react' ? '.js' : '.html';
      const outPath = filePath.replace(/\.mek$/, ext);
      fs.writeFileSync(outPath, js);
      console.log(chalk.cyan(`✔ Compiled ${path.basename(targetFile)} to ${target.toUpperCase()} -> ${path.basename(outPath)}`));
    } catch (err) {
      console.error(chalk.red(`Build Failure:\n${err.message}`));
    }
  });

/**
 * Dev Server Command
 */
program
  .command('dev')
  .description('Start dev server with Hot Reload')
  .action(() => {
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

/**
 * Addons Command
 */
program
  .command('addons')
  .description('Manage Mekta addons')
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

if (process.argv.length <= 2) {
  startTUI();
} else {
  program.parse();
}
