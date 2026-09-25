import React from 'react';

/**
 * MektA Client/Server Core Runtime
 */

export function createElement(tag, props, ...children) {
  const actualTag = (tag === 'page') ? 'div' :
                    (tag === 'heading') ? 'h1' :
                    (tag === 'text') ? 'p' :
                    tag;

  return React.createElement(actualTag, props, ...children);
}

/**
 * Reactive state hook wrapper
 */
export function createState(initialValue) {
  return React.useState(initialValue);
}

/**
 * Lifecycle hook wrapper
 */
export function onMount(fn) {
  return React.useEffect(() => {
    fn();
  }, []);
}

/**
 * Client-side data fetcher utility
 */
export async function fetchData(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
  return res.json();
}

/**
 * Hydration script bundle helper
 */
export function getHydrationScript(initialState = {}) {
  return `<script>
    window.__MEKTA_STATE__ = ${JSON.stringify(initialState)};
  </script>`;
}
