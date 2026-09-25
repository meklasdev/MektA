import fs from 'fs';
import path from 'path';

/**
 * Default MektA Configuration
 */
export const defaultConfig = {
  target: 'react',
  pages: './pages',
  components: './components',
  server: {
    port: 3000,
    host: 'localhost'
  },
  compiler: {
    sourceMaps: true,
    minify: false,
    strictTypes: false
  },
  addons: [],
  ai: {
    enabled: true
  }
};

/**
 * Helper function for typed config definitions in JS/TS configuration files.
 * @param {import('../types').MektAConfig} config
 */
export function defineConfig(config) {
  return config;
}

/**
 * Asynchronously or synchronously loads MektA configuration from project directory.
 * @param {string} [rootDir=process.cwd()]
 * @returns {typeof defaultConfig}
 */
export function loadConfig(rootDir = process.cwd()) {
  const possibleFiles = [
    'mekta.config.js',
    'mekta.config.json',
    'mekta.config.ts'
  ];

  for (const file of possibleFiles) {
    const fullPath = path.resolve(rootDir, file);
    if (fs.existsSync(fullPath)) {
      try {
        if (file.endsWith('.json')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const jsonConfig = JSON.parse(content);
          return mergeConfig(defaultConfig, jsonConfig);
        }
      } catch (err) {
        console.warn(`[MektA Config] Failed to parse ${file}: ${err.message}`);
      }
    }
  }

  return defaultConfig;
}

function mergeConfig(base, custom) {
  if (!custom) return { ...base };
  return {
    ...base,
    ...custom,
    server: { ...base.server, ...(custom.server || {}) },
    compiler: { ...base.compiler, ...(custom.compiler || {}) },
    ai: { ...base.ai, ...(custom.ai || {}) }
  };
}
