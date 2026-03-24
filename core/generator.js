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
        const cond = props['m-if'].value; delete props['m-if'];
        const inner = generateReact({ ...node, props });
        return `(${cond}) ? ${inner} : null`;
      }
      if (props['m-for']) {
        const [item, list] = props['m-for'].value.split(' in ').map(s => s.trim());
        delete props['m-for'];
        const inner = generateReact({ ...node, props });
        return `(${list}).map((${item}) => ${inner})`;
      }

      // Safe Prop Mapping
      const mappedPropEntries = Object.entries(props).map(([key, attr]) => {
        let mappedKey = key;
        if (key === 'class') mappedKey = 'className';
        if (key === 'for') mappedKey = 'htmlFor';
        if (key === 'tabindex') mappedKey = 'tabIndex';
        if (key.startsWith('on')) {
           const event = key.charAt(2).toUpperCase() + key.slice(3);
           mappedKey = `on${event}`;
        }

        const val = attr.type === 'Expression' ? attr.value : JSON.stringify(attr.value);
        return `${mappedKey}: ${val}`;
      });

      const propsObj = mappedPropEntries.length > 0 ? `{ ${mappedPropEntries.join(', ')} }` : 'null';
      const children = node.children.map(generateReact).filter(Boolean).join(', ');
      return `createElement("${node.tag}", ${propsObj}${children ? `, ${children}` : ''})`;

    case 'TextNode':
      return `"${node.value.replace(/"/g, '\\"')}"`;

    case 'ExpressionNode':
      return node.value;

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
        .map(([k, v]) => ` ${k}="${v.value}"`).join('');
      const children = node.children.map(generateHTML).join('');
      return `<${node.tag}${props}>${children}</${node.tag}>`;
    case 'TextNode': return node.value;
    case 'ExpressionNode': return `{{ ${node.value} }}`;
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
