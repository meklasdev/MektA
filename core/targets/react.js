/**
 * MektA React Target Code Generator
 * Compiles AST to clean, readable React / JSX compatible ES or CJS modules.
 */

export function generateReact(ast, options = {}) {
  const isCjs = options.moduleFormat === 'cjs';

  const usedComponents = new Set();

  function renderNode(node) {
    if (!node) return 'null';

    switch (node.type) {
      case 'Program':
        return node.body.map(renderNode).filter(Boolean).join(',\n');

      case 'Page':
      case 'Layout':
      case 'Fragment':
        const children = node.children.map(renderNode).filter(Boolean).join(', ');
        return `createElement(React.Fragment, null${children ? `, ${children}` : ''})`;

      case 'Slot':
        return `(props.children || ${node.fallback.length ? renderNode(node.fallback[0]) : 'null'})`;

      case 'Conditional': {
        const cons = node.consequent.map(renderNode).filter(Boolean).join(', ');
        const alt = node.alternate ? renderNode(node.alternate) : 'null';
        const consCode = cons ? (node.consequent.length > 1 ? `createElement(React.Fragment, null, ${cons})` : cons) : 'null';
        return `((${node.test}) ? ${consCode} : ${alt})`;
      }

      case 'Loop': {
        const inner = node.children.map(renderNode).filter(Boolean).join(', ');
        const bodyCode = node.children.length > 1 ? `createElement(React.Fragment, null, ${inner})` : inner;
        return `(Array.isArray(${node.iterable}) ? (${node.iterable}).map((${node.item}, index) => ${bodyCode}) : null)`;
      }

      case 'Element':
      case 'Component': {
        const compName = node.name || node.tag;
        const isComp = node.type === 'Component' || (compName && /^[A-Z]/.test(compName));

        if (isComp && compName) {
          usedComponents.add(String(compName));
        }

        const tag = isComp ? compName : `"${compName}"`;

        const propsObj = {};
        for (const attr of (node.attributes || [])) {
          if (attr.type === 'EventDirective') {
            const eventProp = 'on' + attr.event.charAt(0).toUpperCase() + attr.event.slice(1);
            propsObj[eventProp] = attr.handler;
          } else if (attr.name && attr.name.startsWith('m-')) {
            if (attr.name === 'm-disabled') propsObj['disabled'] = attr.value;
            else if (attr.name === 'm-class') propsObj['className'] = attr.value;
          } else {
            let key = attr.name;
            if (key === 'class') key = 'className';
            if (key === 'for') key = 'htmlFor';

            propsObj[key] = attr.isExpression ? attr.value : JSON.stringify(attr.value);
          }
        }

        const propEntries = Object.entries(propsObj).map(([k, v]) => `${k}: ${v}`);
        const propsArg = propEntries.length ? `{ ${propEntries.join(', ')} }` : 'null';

        const childCode = node.children.map(renderNode).filter(Boolean).join(', ');
        return `createElement(${tag}, ${propsArg}${childCode ? `, ${childCode}` : ''})`;
      }

      case 'Text':
        return JSON.stringify(node.value);

      case 'Expression':
        return node.value;

      case 'Comment':
        return `/* ${node.value} */`;

      default:
        return 'null';
    }
  }

  const scripts = ast.scripts ? ast.scripts.map(s => s.content).join('\n') : '';
  const bodyCode = renderNode(ast);

  // Auto-imports for components in ESM
  const autoImports = Array.from(usedComponents)
    .filter(Boolean)
    .map(comp => `import ${comp} from '@/components/${comp}.mek';`)
    .join('\n');

  if (isCjs) {
    // CommonJS output for Node.js VM SSR evaluation
    const compFallbackDefs = Array.from(usedComponents)
      .filter(Boolean)
      .map(comp => `const ${comp} = (props) => createElement('div', { className: '${String(comp).toLowerCase()}' }, props ? props.children : null);`)
      .join('\n');

    return `
const React = require('react');
const { createElement } = React;

${compFallbackDefs}

${scripts}

module.exports = function Component(props) {
  return (
    ${bodyCode}
  );
};
`;
  }

  // ES Module output for client build targets
  return `import React, { createElement } from 'react';
${autoImports ? autoImports + '\n' : ''}
${scripts}

export default function Component(props) {
  return (
    ${bodyCode}
  );
}
`;
}
