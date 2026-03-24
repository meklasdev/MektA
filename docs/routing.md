# Mekta Routing System

Mekta implements a file-system based routing system inspired by Next.js.

## Structure

Your pages should be placed in the `pages/` directory at the root of your project.

- `pages/index.mek` -> `/`
- `pages/about.mek` -> `/about`
- `pages/docs/index.mek` -> `/docs`
- `pages/posts/[id].mek` -> `/posts/1`, `/posts/abc`, etc.

## Dynamic Routes

File names with square brackets like `[id].mek` denote dynamic routes. The value captured by the route is injected into your `.mek` component as a variable.

**Example: `pages/posts/[id].mek`**
```mek
<page>
  <text>Post ID: {id}</text>
</page>
```

## Route Resolution

The Mekta server automatically resolves these paths:
1. Exact match (`/about` -> `pages/about.mek`)
2. Directory index (`/docs` -> `pages/docs/index.mek`)
3. Dynamic match (`/posts/123` -> `pages/posts/[id].mek` with `{id: '123'}`)
