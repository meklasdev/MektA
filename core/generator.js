/**
 * Enhanced Code Generator for .mek
 */
export function generate(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(generate).join(',\n');

    case 'Element':
      const props = node.props && Object.keys(node.props).length > 0
        ? JSON.stringify(node.props).replace(/"([^"]+)":/g, '$1:')
        : 'null';

      // Fix: Comprehensive attribute renaming for React
      let reactProps = props
        .replace(/class:/g, 'className:')
        .replace(/id:/g, 'id:')
        .replace(/src:/g, 'src:')
        .replace(/href:/g, 'href:');

      const children = node.children.map(generate).filter(c => c !== null).join(', ');

      return `createElement("${node.tag}", ${reactProps}${children ? `, ${children}` : ''})`;

    case 'TextNode':
      return `"${node.value.replace(/"/g, '\\"')}"`;

    case 'CommentNode':
      return `/* ${node.value} */`;

    default:
      return null;
  }
}
