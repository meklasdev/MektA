import { tokenize, parse } from './parser.js';
import { generate } from './generator.js';

/**
 * Mekta Compiler Core
 */
export function compile(source) {
  try {
    // Extract Style Blocks
    const styles = [];
    const cleanSource = source.replace(/<style>([\s\S]*?)<\/style>/g, (match, p1) => {
      styles.push(p1.trim());
      return '';
    });

    const tokens = tokenize(cleanSource);
    const ast = parse(tokens);
    const js = generate(ast);

    return {
      js,
      css: styles.join('\n')
    };
  } catch (err) {
    throw new Error(`Compilation failed: ${err.message}`);
  }
}
