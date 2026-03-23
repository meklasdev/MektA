/**
 * Multi-Target Code Generator for .mek
 */

export function generate(node, target = 'react') {
  switch (target) {
    case 'html':
      return generateHTML(node);
    case 'php':
      return generatePHP(node);
    case 'react':
    default:
      return generateReact(node);
  }
}

/**
 * Target: React (JavaScript)
 */
function generateReact(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(generateReact).join(',\n');
    case 'Element':
      const props = node.props && Object.keys(node.props).length > 0
        ? JSON.stringify(node.props).replace(/"([^"]+)":/g, '$1:')
        : 'null';
      const reactProps = props.replace(/class:/g, 'className:');
      const children = node.children.map(generateReact).filter(c => c !== null).join(', ');
      return `createElement("${node.tag}", ${reactProps}${children ? `, ${children}` : ''})`;
    case 'TextNode':
      return `"${node.value.replace(/"/g, '\\"')}"`;
    case 'CommentNode':
      return `/* ${node.value} */`;
    default:
      return null;
  }
}

/**
 * Target: Static HTML
 */
function generateHTML(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(generateHTML).join('\n');
    case 'Element':
      const props = Object.entries(node.props)
        .map(([k, v]) => ` ${k}="${v}"`)
        .join('');
      const children = node.children.map(generateHTML).join('');
      return `<${node.tag}${props}>${children}</${node.tag}>`;
    case 'TextNode':
      return node.value;
    case 'CommentNode':
      return `<!-- ${node.value} -->`;
    default:
      return '';
  }
}

/**
 * Target: PHP Template (Enhanced)
 */
function generatePHP(node) {
  switch (node.type) {
    case 'Program':
      return '<?php\n/** Mekta PHP Target - Production Ready */\n' +
             node.body.map(n => `echo "${generateHTML(n).replace(/"/g, '\\"')}";`).join('\n') +
             '\n?>';
    default:
      return '';
  }
}
