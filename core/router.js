import fs from 'fs';
import path from 'path';
import { compile } from '../core/compiler.js';

/**
 * Mekta Router (Next.js style)
 */
export function resolveRoute(url, pagesDir = 'pages') {
  const routes = [];

  function walk(dir, base = '/') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const isDir = fs.statSync(fullPath).isDirectory();

      if (isDir) {
        walk(fullPath, path.join(base, file));
      } else if (file.endsWith('.mek')) {
        let routePath = path.join(base, file.replace('.mek', ''));
        if (routePath.endsWith('/index')) routePath = routePath.replace('/index', '');
        if (routePath === '') routePath = '/';

        // Dynamic route detection [id]
        const pattern = routePath.replace(/\[([^\]]+)\]/g, '(?<$1>[^/]+)');
        routes.push({
          path: routePath,
          regex: new RegExp(`^${pattern}$`),
          file: fullPath
        });
      }
    }
  }

  if (fs.existsSync(pagesDir)) {
    walk(pagesDir);
  }

  // Sort routes: static first, then dynamic
  routes.sort((a, b) => b.path.length - a.path.length);

  for (const route of routes) {
    const match = url.match(route.regex);
    if (match) {
      return {
        file: route.file,
        params: match.groups || {}
      };
    }
  }

  return null;
}
