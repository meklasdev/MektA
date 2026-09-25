import { tokenize, parse } from './parser.js';
import { DiagnosticsBag, MektADiagnostic, DiagnosticCategory, DiagnosticSeverity } from './diagnostics.js';
import { checkTypes } from './types.js';
import { generateReact } from './targets/react.js';
import { generateHTML } from './targets/html.js';
import { transformAST } from './ast/nodes.js';
import crypto from 'crypto';

const compilationCache = new Map();

function computeCacheKey(source, opts) {
  const serializableOpts = {
    target: opts.target,
    filename: opts.filename,
    moduleFormat: opts.moduleFormat || 'esm',
    strictTypes: opts.strictTypes,
    pluginNames: (opts.plugins || []).map(p => p.name || 'unnamed_plugin')
  };
  return crypto.createHash('md5').update(source + JSON.stringify(serializableOpts)).digest('hex');
}

/**
 * MektA Compiler Pipeline Engine
 */
export function compile(source, options = {}) {
  const opts = {
    target: options.target || 'react',
    filename: options.filename || 'unknown.mek',
    moduleFormat: options.moduleFormat || 'esm', // 'esm' | 'cjs'
    cache: options.cache !== false,
    debug: options.debug || false,
    plugins: options.plugins || [],
    strictTypes: options.strictTypes !== false
  };

  const diagnostics = new DiagnosticsBag();

  // 1. Cache lookup
  if (opts.cache) {
    const hash = computeCacheKey(source, opts);
    if (compilationCache.has(hash)) {
      return compilationCache.get(hash);
    }
  }

  // 2. Plugin Hook: beforeLex
  for (const plugin of opts.plugins) {
    if (plugin.beforeLex) {
      source = plugin.beforeLex(source, opts);
    }
  }

  // 3. Lexer
  const tokens = tokenize(source, opts.filename, diagnostics);

  // 4. Parser
  let ast = parse(tokens, opts.filename, diagnostics);

  // 5. Plugin Hook: afterParse
  for (const plugin of opts.plugins) {
    if (plugin.afterParse) {
      ast = plugin.afterParse(ast, opts) || ast;
    }
  }

  // 6. Type Checking & Semantic Analysis
  if (opts.strictTypes) {
    checkTypes(ast, opts.filename, diagnostics);
  }

  // 7. AST Transforms & Optimization
  transformAST(ast, [
    (node) => {
      if (node.type === 'Element' && node.tag === 'heading') {
        node.tag = 'h1'; // Tag normalization optimization
      }
    }
  ]);

  // If diagnostics contain fatal errors, throw formatted diagnostics error
  if (diagnostics.hasErrors()) {
    const errText = diagnostics.formatAll(source);
    const err = new Error(errText);
    err.diagnostics = diagnostics;
    throw err;
  }

  // 8. Code Generation per Target
  let js = '';
  let css = ast.styles ? ast.styles.map(s => s.content).join('\n') : '';

  if (opts.target === 'html') {
    js = generateHTML(ast, opts);
  } else {
    js = generateReact(ast, opts);
  }

  const result = {
    js,
    css,
    ast,
    diagnostics,
    target: opts.target,
    filename: opts.filename
  };

  if (opts.cache) {
    const hash = computeCacheKey(source, opts);
    compilationCache.set(hash, result);
  }

  return result;
}

export function clearCompilerCache() {
  compilationCache.clear();
}
