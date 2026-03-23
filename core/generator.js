/**
 * AST to JavaScript Code Generator
 */
export function generate(node) {
  if (node.type === 'Program') {
    return node.body.map(generate).join('\n');
  }

  if (node.type === 'TextNode') {
    return `"${node.value.replace(/"/g, '\\"')}"`;
  }

  if (node.type === 'Element') {
    const tag = `"${node.tag}"`;
    const props = Object.keys(node.props).length > 0
      ? JSON.stringify(node.props)
      : 'null';

    const children = node.children.map(generate).join(', ');

    if (children) {
      return `createElement(${tag}, ${props}, ${children})`;
    } else {
      return `createElement(${tag}, ${props})`;
    }
  }

  throw new Error(`Unknown node type: ${node.type}`);
}
