/**
 * Mekta Multi-Target Code Generator (v1.5 Architect Edition)
 * Production-ready compilation for React, Static HTML, and PHP.
 */

export function generate(node, target = 'react') {
  switch (target) {
    case 'html': return generateHTML(node);
    case 'php':  return generatePHP(node);
    default:     return generateReact(node);
  }
}

/**
 * React Backend (v1.5)
 * Supports Fragments, Directives, and Event Mapping.
 */
function generateReact(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(generateReact).join(',\n');

    case 'Fragment':
      const fragChildren = node.children.map(generateReact).filter(Boolean).join(', ');
      return `createElement(React.Fragment, null${fragChildren ? `, ${fragChildren}` : ''})`;

    case 'Element':
      const props = { ...node.props };

      // Directives
      if (props['m-if']) {
        const cond = props['m-if']; delete props['m-if'];
        return `(${cond}) ? ${generateReact({ ...node, props })} : null`;
      }
      if (props['m-for']) {
        const [item, list] = props['m-for'].split(' in ').map(s => s.trim());
        delete props['m-for'];
        return `(${list}).map((${item}) => ${generateReact({ ...node, props })})`;
      }

      // Prop Mapping
      const mappedProps = Object.keys(props).length > 0
        ? JSON.stringify(props).replace(/"([^"]+)":/g, '$1:')
            .replace(/class:/g, 'className:')
            .replace(/for:/g, 'htmlFor:')
            .replace(/tabindex:/g, 'tabIndex:')
            .replace(/on([a-z]+):/g, (m, p) => `on${p.charAt(0).toUpperCase() + p.slice(1)}:`)
        : 'null';

      const children = node.children.map(generateReact).filter(Boolean).join(', ');
      return `createElement("${node.tag}", ${mappedProps}${children ? `, ${children}` : ''})`;

    case 'TextNode':
      // Handle template literals ${...} in text nodes
      const text = node.value.replace(/`/g, '\\`');
      if (text.includes('${')) return `\`${text}\``;
      return `"${text.replace(/"/g, '\\"')}"`;

    case 'CommentNode':
      return `/* ${node.value} */`;

    default:
      return null;
  }
}

/**
 * Static HTML Backend (v1.5)
 */
function generateHTML(node) {
  switch (node.type) {
    case 'Program': return node.body.map(generateHTML).join('\n');
    case 'Fragment': return node.children.map(generateHTML).join('');
    case 'Element':
      const props = Object.entries(node.props)
        .filter(([k]) => !k.startsWith('m-'))
        .map(([k, v]) => ` ${k}="${v}"`).join('');
      const children = node.children.map(generateHTML).join('');
      return `<${node.tag}${props}>${children}</${node.tag}>`;
    case 'TextNode': return node.value;
    case 'CommentNode': return `<!-- ${node.value} -->`;
    default: return '';
  }
}

/**
 * PHP Template Backend (v1.5 Architect Edition)
 */
function generatePHP(node) {
  switch (node.type) {
    case 'Program':
      return '<?php\n/** MEKTA_PHP_TARGET_v1.5 */\n' +
             node.body.map(n => `echo "${generateHTML(n).replace(/"/g, '\\"')}";`).join('\n') +
             '\n?>';
    default:
      return '';
  }
}
