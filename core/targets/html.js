/**
 * MektA Static HTML Code Generator
 */

export function generateHTML(ast, options = {}) {
  const tagMap = {
    'page': 'div',
    'heading': 'h1',
    'text': 'p',
    'hero': 'section',
    'card': 'div',
    'grid': 'div'
  };

  function renderNode(node) {
    if (!node) return '';

    switch (node.type) {
      case 'Program':
        return node.body.map(renderNode).join('\n');

      case 'Page':
      case 'Layout':
      case 'Fragment':
        return node.children.map(renderNode).join('');

      case 'Element':
      case 'Component': {
        const tagName = tagMap[node.tag.toLowerCase()] || node.tag.toLowerCase();
        const attrs = (node.attributes || [])
          .filter(a => a.name && !a.name.startsWith('m-'))
          .map(a => ` ${a.name}="${a.value}"`)
          .join('');

        const children = node.children.map(renderNode).join('');
        if (node.isSelfClosing) return `<${tagName}${attrs} />`;
        return `<${tagName}${attrs}>${children}</${tagName}>`;
      }

      case 'Text':
        return node.value;

      case 'Expression':
        return `<!-- {${node.value}} -->`;

      default:
        return '';
    }
  }

  let html = renderNode(ast);
  if (options.minify) {
    html = html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
  }
  return html;
}
