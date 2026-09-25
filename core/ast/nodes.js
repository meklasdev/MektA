/**
 * MektA AST Node Definitions & Visitor Utilities
 */

export const ASTNodeType = {
  Program: 'Program',
  Page: 'Page',
  Layout: 'Layout',
  Slot: 'Slot',
  Fragment: 'Fragment',
  Element: 'Element',
  Component: 'Component',
  Text: 'Text',
  Expression: 'Expression',
  Attribute: 'Attribute',
  EventDirective: 'EventDirective',
  Conditional: 'Conditional', // <if>, <else>, or m-if
  Loop: 'Loop', // <for>, m-for
  Import: 'Import',
  Export: 'Export',
  Script: 'Script',
  Style: 'Style',
  Comment: 'Comment'
};

export class ASTNode {
  constructor(type, loc = null) {
    this.type = type;
    this.loc = loc || {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 1, offset: 0 }
    };
  }
}

export class ProgramNode extends ASTNode {
  constructor(body = [], imports = [], exports = [], scripts = [], styles = [], loc = null) {
    super(ASTNodeType.Program, loc);
    this.body = body;
    this.imports = imports;
    this.exports = exports;
    this.scripts = scripts;
    this.styles = styles;
  }
}

export class PageNode extends ASTNode {
  constructor(title = '', layout = null, metadata = {}, children = [], loc = null) {
    super(ASTNodeType.Page, loc);
    this.title = title;
    this.layout = layout;
    this.metadata = metadata;
    this.children = children;
  }
}

export class LayoutNode extends ASTNode {
  constructor(name = 'default', children = [], loc = null) {
    super(ASTNodeType.Layout, loc);
    this.name = name;
    this.children = children;
  }
}

export class SlotNode extends ASTNode {
  constructor(name = 'default', fallback = [], loc = null) {
    super(ASTNodeType.Slot, loc);
    this.name = name;
    this.fallback = fallback;
  }
}

export class ElementNode extends ASTNode {
  constructor(tag, attributes = [], children = [], isSelfClosing = false, loc = null) {
    super(ASTNodeType.Element, loc);
    this.tag = tag;
    this.attributes = attributes;
    this.children = children;
    this.isSelfClosing = isSelfClosing;
  }
}

export class ComponentNode extends ASTNode {
  constructor(name, attributes = [], children = [], slots = {}, loc = null) {
    super(ASTNodeType.Component, loc);
    this.name = name;
    this.attributes = attributes;
    this.children = children;
    this.slots = slots;
  }
}

export class TextNode extends ASTNode {
  constructor(value, loc = null) {
    super(ASTNodeType.Text, loc);
    this.value = value;
  }
}

export class ExpressionNode extends ASTNode {
  constructor(value, loc = null) {
    super(ASTNodeType.Expression, loc);
    this.value = value;
  }
}

export class AttributeNode extends ASTNode {
  constructor(name, value, isExpression = false, loc = null) {
    super(ASTNodeType.Attribute, loc);
    this.name = name;
    this.value = value;
    this.isExpression = isExpression;
  }
}

export class EventDirectiveNode extends ASTNode {
  constructor(event, handler, loc = null) {
    super(ASTNodeType.EventDirective, loc);
    this.event = event; // e.g. 'click'
    this.handler = handler; // e.g. 'openSettings'
  }
}

export class ConditionalNode extends ASTNode {
  constructor(test, consequent = [], alternate = null, loc = null) {
    super(ASTNodeType.Conditional, loc);
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }
}

export class LoopNode extends ASTNode {
  constructor(item, iterable, children = [], index = null, loc = null) {
    super(ASTNodeType.Loop, loc);
    this.item = item;
    this.iterable = iterable;
    this.children = children;
    this.index = index;
  }
}

export class ImportNode extends ASTNode {
  constructor(specifiers = [], source = '', loc = null) {
    super(ASTNodeType.Import, loc);
    this.specifiers = specifiers; // [{ imported, local }]
    this.source = source;
  }
}

export class ExportNode extends ASTNode {
  constructor(declaration = null, loc = null) {
    super(ASTNodeType.Export, loc);
    this.declaration = declaration;
  }
}

export class ScriptNode extends ASTNode {
  constructor(content, lang = 'ts', targetBoundary = 'client', loc = null) {
    super(ASTNodeType.Script, loc);
    this.content = content;
    this.lang = lang;
    this.targetBoundary = targetBoundary; // 'client' | 'server'
  }
}

export class StyleNode extends ASTNode {
  constructor(content, scoped = true, loc = null) {
    super(ASTNodeType.Style, loc);
    this.content = content;
    this.scoped = scoped;
  }
}

export class FragmentNode extends ASTNode {
  constructor(children = [], loc = null) {
    super(ASTNodeType.Fragment, loc);
    this.children = children;
  }
}

export class CommentNode extends ASTNode {
  constructor(value, loc = null) {
    super(ASTNodeType.Comment, loc);
    this.value = value;
  }
}

/**
 * Traverses the AST with enter and exit hooks.
 */
export function walkAST(node, visitor, parent = null) {
  if (!node || typeof node !== 'object') return;

  if (visitor.enter) {
    visitor.enter(node, parent);
  }

  const keys = ['body', 'children', 'consequent', 'alternate', 'fallback', 'declaration'];
  for (const key of keys) {
    if (node[key]) {
      if (Array.isArray(node[key])) {
        for (const child of node[key]) {
          walkAST(child, visitor, node);
        }
      } else if (typeof node[key] === 'object') {
        walkAST(node[key], visitor, node);
      }
    }
  }

  if (visitor.exit) {
    visitor.exit(node, parent);
  }
}

/**
 * Transforms AST nodes immutably or in place via transformers.
 */
export function transformAST(ast, transformers = []) {
  for (const transformer of transformers) {
    walkAST(ast, {
      enter: (node, parent) => {
        if (typeof transformer === 'function') {
          transformer(node, parent);
        } else if (transformer[node.type]) {
          transformer[node.type](node, parent);
        }
      }
    });
  }
  return ast;
}

export function serializeAST(ast) {
  return JSON.stringify(ast, null, 2);
}
