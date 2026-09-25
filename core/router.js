import fs from 'fs';
import path from 'path';

/**
 * MektA File-System Router Engine
 */
export class Router {
  constructor(pagesDir = 'pages') {
    this.pagesDir = pagesDir;
    this.routes = [];
    this.apiRoutes = [];
  }

  /**
   * Scans pages directory and builds internal routing table.
   * @param {string} [rootDir=process.cwd()]
   */
  scanRoutes(rootDir = process.cwd()) {
    const fullPagesDir = path.resolve(rootDir, this.pagesDir);
    this.routes = [];
    this.apiRoutes = [];

    if (!fs.existsSync(fullPagesDir)) return;

    const walk = (dir, baseRoute = '/') => {
      const files = fs.readdirSync(dir, { withFileTypes: true });

      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        const relativeDir = path.relative(fullPagesDir, dir);

        if (file.isDirectory()) {
          walk(fullPath, path.join(baseRoute, file.name));
        } else if (file.name.endsWith('.mek') || file.name.endsWith('.js')) {
          if (file.name === 'layout.mek' || file.name === 'loading.mek' || file.name === 'error.mek') {
            continue; // Layout, loading, error special files
          }

          let routeName = file.name.replace(/\.(mek|js)$/, '');
          if (routeName === 'index') routeName = '';

          let routePath = path.join(baseRoute, routeName).replace(/\\/g, '/');
          if (routePath.length > 1 && routePath.endsWith('/')) {
            routePath = routePath.slice(0, -1);
          }
          if (routePath === '') routePath = '/';

          // API Routes detection
          if (routePath.startsWith('/api/') || baseRoute.startsWith('/api')) {
            this.apiRoutes.push({
              path: routePath,
              file: fullPath
            });
            continue;
          }

          // Catch-all [...slug] detection
          const isCatchAll = /\[\.\.\.([^\]]+)\]/.test(routePath);
          let pattern = routePath;

          if (isCatchAll) {
            pattern = pattern.replace(/\[\.\.\.([^\]]+)\]/g, '(?<$1>.*)');
          } else {
            // Dynamic parameter [id]
            pattern = pattern.replace(/\[([^\]]+)\]/g, '(?<$1>[^/]+)');
          }

          // Find layout, loading, error files up the directory tree
          const layouts = [];
          let loadingFile = null;
          let errorFile = null;

          let currentDir = dir;
          while (currentDir.startsWith(fullPagesDir)) {
            const layoutFile = path.join(currentDir, 'layout.mek');
            if (fs.existsSync(layoutFile)) layouts.unshift(layoutFile);

            const loadFile = path.join(currentDir, 'loading.mek');
            if (!loadingFile && fs.existsSync(loadFile)) loadingFile = loadFile;

            const errFile = path.join(currentDir, 'error.mek');
            if (!errorFile && fs.existsSync(errFile)) errorFile = errFile;

            currentDir = path.dirname(currentDir);
          }

          this.routes.push({
            path: routePath,
            file: fullPath,
            regex: new RegExp(`^${pattern}$`),
            isCatchAll,
            isDynamic: routePath.includes('['),
            layouts,
            loadingFile,
            errorFile
          });
        }
      }
    };

    walk(fullPagesDir);

    // Sort routes: exact static routes first, dynamic routes second, catch-all last
    this.routes.sort((a, b) => {
      if (a.isCatchAll && !b.isCatchAll) return 1;
      if (!a.isCatchAll && b.isCatchAll) return -1;
      if (a.isDynamic && !b.isDynamic) return 1;
      if (!a.isDynamic && b.isDynamic) return -1;
      return b.path.length - a.path.length;
    });
  }

  /**
   * Resolves a URL path against the routing table.
   * @param {string} urlPath
   */
  resolve(urlPath) {
    const cleanUrl = urlPath.split('?')[0];

    for (const route of this.routes) {
      const match = cleanUrl.match(route.regex);
      if (match) {
        return {
          route,
          file: route.file,
          params: match.groups || {},
          layouts: route.layouts,
          loadingFile: route.loadingFile,
          errorFile: route.errorFile
        };
      }
    }

    return null;
  }
}

export function resolveRoute(url, pagesDir = 'pages') {
  const router = new Router(pagesDir);
  router.scanRoutes(process.cwd());
  return router.resolve(url);
}
