import { tokenize, parse } from './parser.js';
import { generate } from './generator.js';

/**
 * Mekta Compiler
 */
export function compile(source) {
  try {
    const tokens = tokenize(source);
    const ast = parse(tokens);
    const js = generate(ast);
    return js;
  } catch (error) {
    console.error('Compilation failed:', error);
    throw error;
  }
}
