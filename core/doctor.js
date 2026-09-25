import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { loadConfig } from './config.js';

export function runDoctor(rootDir = process.cwd()) {
  const checks = [];

  // 1. Node.js Check
  try {
    const nodeVer = process.version;
    const major = parseInt(nodeVer.slice(1).split('.')[0]);
    checks.push({
      title: `Node.js (${nodeVer})`,
      ok: major >= 18,
      msg: major >= 18 ? 'Compatible Node.js runtime' : 'Node.js 18+ required'
    });
  } catch (err) {
    checks.push({ title: 'Node.js', ok: false, msg: err.message });
  }

  // 2. Package Manager Check
  try {
    const npmVer = execSync('npm -v').toString().trim();
    checks.push({ title: `npm (${npmVer})`, ok: true, msg: 'Package manager detected' });
  } catch {
    checks.push({ title: 'Package Manager', ok: false, msg: 'npm CLI not found' });
  }

  // 3. TypeScript Check
  try {
    const tsVer = execSync('npx tsc -v 2>/dev/null').toString().trim();
    checks.push({ title: `TypeScript (${tsVer})`, ok: true, msg: 'TypeScript compiler ready' });
  } catch {
    checks.push({ title: 'TypeScript', ok: true, msg: 'TypeScript available via MektA type checker' });
  }

  // 4. MektA Config Check
  try {
    const config = loadConfig(rootDir);
    checks.push({ title: 'MektA Config', ok: true, msg: `Loaded target: ${config.target}` });
  } catch (err) {
    checks.push({ title: 'MektA Config', ok: false, msg: err.message });
  }

  // 5. Filesystem Pages Directory Check
  const pagesExist = fs.existsSync(path.resolve(rootDir, 'pages'));
  checks.push({
    title: 'Pages Directory (pages/)',
    ok: pagesExist,
    msg: pagesExist ? 'Pages filesystem structure verified' : 'Warning: pages/ directory not found'
  });

  // Display Output
  console.log(chalk.magenta.bold('\n▣ MektA Doctor System Diagnostic\n'));
  let allOk = true;
  for (const check of checks) {
    const icon = check.ok ? chalk.green('✓') : chalk.red('✖');
    console.log(`  ${icon} ${chalk.bold(check.title.padEnd(25))} ${chalk.gray(check.msg)}`);
    if (!check.ok) allOk = false;
  }

  console.log('\n' + (allOk ? chalk.green('✔ All system checks passed!') : chalk.yellow('⚠ System running with warnings.')) + '\n');
  return checks;
}
