import { tokenize, parse } from './parser.js';

/**
 * AST-aware Formatter for .mek files.
 */
export function formatMek(source) {
  const tokens = tokenize(source);
  const ast = parse(tokens);

  let indent = 0;
  const getIndent = () => '  '.repeat(indent);

  function formatNode(node) {
    if (!node) return '';

    switch (node.type) {
      case 'Program': {
        const parts = [];
        if (node.scripts && node.scripts.length) {
          parts.push(...node.scripts.map(s => `<script lang="${s.lang}">\n${s.content.trim()}\n</script>`));
        }
        if (node.styles && node.styles.length) {
          parts.push(...node.styles.map(s => `<style>\n${s.content.trim()}\n</style>`));
        }
        parts.push(...node.body.map(formatNode).filter(Boolean));
        return parts.join('\n\n') + '\n';
      }

      case 'Page': {
        const attrs = [];
        if (node.title) attrs.push(`title="${node.title}"`);
        if (node.layout) attrs.push(`layout="${node.layout}"`);
        const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';

        indent++;
        const childrenStr = node.children.map(c => getIndent() + formatNode(c)).filter(Boolean).join('\n');
        indent--;

        return `<page${attrStr}>\n${childrenStr}\n</page>`;
      }

      case 'Element':
      case 'Component': {
        const attrs = (node.attributes || []).map(a => {
          if (a.type === 'EventDirective') return `m-on:${a.event}={${a.handler}}`;
          if (a.isExpression) return `${a.name}={${a.value}}`;
          return `${a.name}="${a.value}"`;
        }).join(' ');

        const attrStr = attrs ? ' ' + attrs : '';
        if (node.isSelfClosing) return `<${node.tag}${attrStr} />`;

        if (!node.children || node.children.length === 0) {
          return `<${node.tag}${attrStr}></${node.tag}>`;
        }

        indent++;
        const childrenStr = node.children.map(c => getIndent() + formatNode(c)).filter(Boolean).join('\n');
        indent--;

        return `<${node.tag}${attrStr}>\n${childrenStr}\n${getIndent()}</${node.tag}>`;
      }

      case 'Conditional': {
        indent++;
        const consStr = node.consequent.map(c => getIndent() + formatNode(c)).filter(Boolean).join('\n');
        indent--;

        let code = `<if condition={${node.test}}>\n${consStr}\n${getIndent()}</if>`;
        if (node.alternate) {
          code += `\n${getIndent()}<else>\n${formatNode(node.alternate)}\n${getIndent()}</else>`;
        }
        return code;
      }

      case 'Loop': {
        indent++;
        const childrenStr = node.children.map(c => getIndent() + formatNode(c)).filter(Boolean).join('\n');
        indent--;
        return `<for item={${node.item}} in={${node.iterable}}>\n${childrenStr}\n${getIndent()}</for>`;
      }

      case 'Text':
        return node.value.trim();

      case 'Expression':
        return `{${node.value}}`;

      case 'Comment':
        return `<!-- ${node.value} -->`;

      default:
        return '';
    }
  }

  return formatNode(ast);
}

export function formatMekCheck(source) {
  const formatted = formatMek(source);
  return formatted.trim() === source.trim();
}
