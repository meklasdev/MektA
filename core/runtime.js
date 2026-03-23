import React from 'react';

/**
 * Mekta Runtime: wraps React.createElement
 */
export function createElement(tag, props, ...children) {
  // Map .mek tags to HTML where appropriate or leave as is for components
  // For simplicity in this framework, we'll treat them as HTML tags
  // unless they start with a capital letter (standard JSX behavior)

  const actualTag = (tag === 'page') ? 'div' :
                    (tag === 'text') ? 'p' :
                    tag;

  return React.createElement(actualTag, props, ...children);
}
