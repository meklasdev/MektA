import fs from 'fs';
import path from 'path';
import { compile } from './compiler.js';

export class ComponentRegistry {
  constructor(componentsDir = 'components') {
    this.componentsDir = componentsDir;
    this.registry = new Map();
  }

  /**
   * Scans components directory and registers available .mek components.
   * @param {string} [rootDir=process.cwd()]
   */
  discoverComponents(rootDir = process.cwd()) {
    const fullDir = path.resolve(rootDir, this.componentsDir);
    if (!fs.existsSync(fullDir)) return;

    const scan = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          scan(fullPath);
        } else if (file.name.endsWith('.mek')) {
          const compName = file.name.replace(/\.mek$/, '');
          this.register(compName, fullPath);
        }
      }
    };

    scan(fullDir);
  }

  register(name, filePath) {
    this.registry.set(name, {
      name,
      filePath,
      source: () => fs.readFileSync(filePath, 'utf8')
    });
  }

  has(name) {
    return this.registry.has(name);
  }

  get(name) {
    return this.registry.get(name);
  }

  /**
   * Resolves component source and compiles it into executable JS.
   * @param {string} name
   */
  resolveAndCompile(name) {
    const comp = this.get(name);
    if (!comp) return null;
    const source = comp.source();
    return compile(source, { filename: comp.filePath, target: 'react' });
  }
}

export const globalComponentRegistry = new ComponentRegistry();
