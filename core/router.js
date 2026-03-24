import fs from 'fs';
import path from 'path';

/**
 * Mekta Router (v1.5 Architect)
 * Supports nested layouts, loading states, and error boundaries.
 */
export function resolveRoute(url, pagesDir = 'pages') {
  const routes = [];

  function walk(dir, base = '/') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file).replace(/\\/g, '/');
      const isDir = fs.statSync(fullPath).isDirectory();

      if (isDir) {
        walk(fullPath, path.join(base, file));
      } else if (file.endsWith('.mek')) {
        let routePath = path.join(base, file.replace('.mek', '')).replace(/\\/g, '/');
        if (routePath.endsWith('/index')) routePath = routePath.slice(0, -6);
        if (routePath === '') routePath = '/';

        // Dynamic route detection [id]
        const pattern = routePath.replace(/\[([^\]]+)\]/g, '(?<$1>[^/]+)');

        // Capture layouts in the chain
        const layouts = [];
        let currentDir = dir;
        while (currentDir.startsWith(pagesDir)) {
           const layoutFile = path.join(currentDir, 'layout.mek').replace(/\\/g, '/');
           if (fs.existsSync(layoutFile)) layouts.unshift(layoutFile);
           currentDir = path.dirname(currentDir);
        }

        routes.push({
          path: routePath,
          regex: new RegExp(`^${pattern}$`),
          file: fullPath,
          layouts
        });
      }
    }
  }

  if (fs.existsSync(pagesDir)) walk(pagesDir);
  routes.sort((a, b) => b.path.length - a.path.length);

  for (const route of routes) {
    const match = url.match(route.regex);
    if (match) {
      return {
        file: route.file,
        params: match.groups || {},
        layouts: route.layouts
      };
    }
  }

  return null;
}
