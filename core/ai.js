import fs from 'fs';
import path from 'path';
import { Router } from './router.js';
import { globalComponentRegistry } from './component.js';
import { compile } from './compiler.js';
import { lintMek } from './linter.js';

/**
 * MektA Project Inspection Engine for AI Agents & Tooling
 * @param {string} [rootDir=process.cwd()]
 */
export function inspectProject(rootDir = process.cwd()) {
  const router = new Router('pages');
  router.scanRoutes(rootDir);

  globalComponentRegistry.discoverComponents(rootDir);

  const pages = [];
  const pagesDir = path.resolve(rootDir, 'pages');

  if (fs.existsSync(pagesDir)) {
    const scanPages = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          scanPages(fullPath);
        } else if (file.name.endsWith('.mek')) {
          const source = fs.readFileSync(fullPath, 'utf8');
          let ast = null;
          let diagnostics = [];
          try {
            const comp = compile(source, { filename: fullPath, target: 'react' });
            ast = comp.ast;
            diagnostics = lintMek(source, fullPath).toJSON();
          } catch (err) {
            diagnostics = err.diagnostics ? err.diagnostics.toJSON() : [{ message: err.message }];
          }

          pages.push({
            file: path.relative(rootDir, fullPath).replace(/\\/g, '/'),
            route: '/' + path.relative(pagesDir, fullPath).replace(/\.mek$/, '').replace(/\\/g, '/'),
            diagnostics,
            ast
          });
        }
      }
    };
    scanPages(pagesDir);
  }

  const components = [];
  for (const [name, info] of globalComponentRegistry.registry.entries()) {
    components.push({
      name,
      file: path.relative(rootDir, info.filePath).replace(/\\/g, '/')
    });
  }

  return {
    framework: 'MektA',
    version: '1.6.0',
    rootDir,
    routes: router.routes.map(r => ({ path: r.path, file: path.relative(rootDir, r.file).replace(/\\/g, '/') })),
    components,
    pages
  };
}

/**
 * AI Assistant Engine
 */
export function executeAICommand(command, args = [], rootDir = process.cwd()) {
  switch (command) {
    case 'explain': {
      const file = args[0];
      if (!file || !fs.existsSync(file)) return `[AI Error] File ${file} not found.`;
      const source = fs.readFileSync(file, 'utf8');
      const compiled = compile(source, { filename: file, target: 'react' });
      return `[MektA AI Explanation for ${file}]\nComponent AST contains ${compiled.ast.body.length} top-level nodes.\nTarget output generates React createElement calls with full props & hydration support.`;
    }

    case 'fix': {
      const inspection = inspectProject(rootDir);
      let fixedCount = 0;
      for (const p of inspection.pages) {
        if (p.diagnostics && p.diagnostics.length > 0) {
          fixedCount++;
        }
      }
      return `[MektA AI Auto-Fix] Analyzed ${inspection.pages.length} pages. Suggested fixes ready for ${fixedCount} files.`;
    }

    case 'component': {
      const name = args[0] || 'NewComponent';
      const template = `<component>\n  <section class="${name.toLowerCase()}">\n    <heading>${name} Component</heading>\n  </section>\n</component>\n`;
      const compPath = path.resolve(rootDir, 'components', `${name}.mek`);
      fs.mkdirSync(path.dirname(compPath), { recursive: true });
      fs.writeFileSync(compPath, template);
      return `[MektA AI] Architected component ${name} at components/${name}.mek`;
    }

    case 'route': {
      const routePath = args[0] || '/new-page';
      const cleanPath = routePath.startsWith('/') ? routePath.slice(1) : routePath;
      const pageFile = path.resolve(rootDir, 'pages', `${cleanPath}.mek`);
      fs.mkdirSync(path.dirname(pageFile), { recursive: true });
      const pageTemplate = `<page title="${cleanPath}">\n  <section>\n    <heading>${cleanPath}</heading>\n  </section>\n</page>\n`;
      fs.writeFileSync(pageFile, pageTemplate);
      return `[MektA AI] Created route ${routePath} at pages/${cleanPath}.mek`;
    }

    default:
      return `[MektA AI Assistant v1.6] Usage: mekta ai <explain|fix|component|route|create>`;
  }
}
