import { tokenize, parse } from './parser.js';
import { generate } from './generator.js';

/**
 * Mekta Compiler Core
 * Supports Multi-Target (React, HTML, PHP)
 */
export function compile(source, options = { target: 'react' }) {
  try {
    const styles = [];
    const cleanSource = source.replace(/<style>([\s\S]*?)<\/style>/g, (match, p1) => {
      styles.push(p1.trim());
      return '';
    });

    const tokens = tokenize(cleanSource);
    const ast = parse(tokens);
    const js = generate(ast, options.target);

    return {
      js,
      css: styles.join('\n'),
      target: options.target
    };
  } catch (err) {
    throw new Error(`Compilation failed: ${err.message}`);
  }
}
