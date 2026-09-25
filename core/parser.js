import {
  ProgramNode,
  PageNode,
  LayoutNode,
  SlotNode,
  ElementNode,
  ComponentNode,
  TextNode,
  ExpressionNode,
  AttributeNode,
  EventDirectiveNode,
  ConditionalNode,
  LoopNode,
  ImportNode,
  ExportNode,
  ScriptNode,
  StyleNode,
  FragmentNode,
  CommentNode,
  ASTNodeType
} from './ast/nodes.js';
import { MektADiagnostic, DiagnosticsBag, DiagnosticCategory, DiagnosticSeverity } from './diagnostics.js';

export const TokenType = {
  OPEN_TAG_START: 'OPEN_TAG_START', // <
  CLOSE_TAG_START: 'CLOSE_TAG_START', // </
  TAG_END: 'TAG_END', // >
  SELF_CLOSE_TAG_END: 'SELF_CLOSE_TAG_END', // />
  FRAGMENT_START: 'FRAGMENT_START', // <>
  FRAGMENT_END: 'FRAGMENT_END', // </>
  IDENTIFIER: 'IDENTIFIER',
  STRING: 'STRING',
  EQUALS: 'EQUALS',
  EXPRESSION: 'EXPRESSION',
  TEXT: 'TEXT',
  COMMENT: 'COMMENT',
  SCRIPT_BLOCK: 'SCRIPT_BLOCK',
  STYLE_BLOCK: 'STYLE_BLOCK',
  EOF: 'EOF'
};

/**
 * Tokenize source code into stream of tokens with accurate line/column locations.
 */
export function tokenize(input, filename = 'unknown.mek', diagnostics = new DiagnosticsBag()) {
  const tokens = [];
  let cursor = 0;
  let line = 1;
  let column = 1;
  let inTag = false;

  const createLoc = (startLine, startCol, startOffset) => ({
    start: { line: startLine, column: startCol, offset: startOffset },
    end: { line, column, offset: cursor }
  });

  while (cursor < input.length) {
    const startOffset = cursor;
    const startLine = line;
    const startCol = column;
    const char = input[cursor];
    const nextChar = input[cursor + 1];

    const advance = (n = 1) => {
      for (let i = 0; i < n; i++) {
        if (input[cursor] === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
        cursor++;
      }
    };

    // Handle HTML Comments <!-- ... -->
    if (char === '<' && input.slice(cursor, cursor + 4) === '<!--') {
      advance(4);
      let value = '';
      while (cursor < input.length && input.slice(cursor, cursor + 3) !== '-->') {
        value += input[cursor];
        advance(1);
      }
      if (input.slice(cursor, cursor + 3) === '-->') {
        advance(3);
      } else {
        diagnostics.add(new MektADiagnostic({
          file: filename,
          line: startLine,
          column: startCol,
          message: 'Unterminated comment',
          hint: 'Add "-->" to close the comment.',
          category: DiagnosticCategory.SYNTAX
        }));
      }
      tokens.push({
        type: TokenType.COMMENT,
        value: value.trim(),
        loc: createLoc(startLine, startCol, startOffset)
      });
      continue;
    }

    // Handle <script ...> ... </script>
    if (!inTag && char === '<' && /^<script[\s>]/.test(input.slice(cursor))) {
      const match = input.slice(cursor).match(/^<script([^>]*)>([\s\S]*?)<\/script>/i);
      if (match) {
        const rawAttrs = match[1];
        const content = match[2];
        const fullLength = match[0].length;

        let lang = 'ts';
        if (/lang=["']js["']/i.test(rawAttrs)) lang = 'js';
        let boundary = 'client';
        if (/\bserver\b/i.test(rawAttrs)) boundary = 'server';

        advance(fullLength);
        tokens.push({
          type: TokenType.SCRIPT_BLOCK,
          content,
          lang,
          boundary,
          loc: createLoc(startLine, startCol, startOffset)
        });
        continue;
      }
    }

    // Handle <style ...> ... </style>
    if (!inTag && char === '<' && /^<style[\s>]/.test(input.slice(cursor))) {
      const match = input.slice(cursor).match(/^<style([^>]*)>([\s\S]*?)<\/style>/i);
      if (match) {
        const rawAttrs = match[1];
        const content = match[2];
        const fullLength = match[0].length;
        const scoped = !/\bglobal\b/i.test(rawAttrs);

        advance(fullLength);
        tokens.push({
          type: TokenType.STYLE_BLOCK,
          content,
          scoped,
          loc: createLoc(startLine, startCol, startOffset)
        });
        continue;
      }
    }

    // Handle Fragment Start <>
    if (char === '<' && nextChar === '>') {
      advance(2);
      tokens.push({ type: TokenType.FRAGMENT_START, loc: createLoc(startLine, startCol, startOffset) });
      continue;
    }

    // Handle Fragment End </>
    if (char === '<' && nextChar === '/' && input[cursor + 2] === '>') {
      advance(3);
      tokens.push({ type: TokenType.FRAGMENT_END, loc: createLoc(startLine, startCol, startOffset) });
      continue;
    }

    // Handle Self-closing Tag End />
    if (char === '/' && nextChar === '>' && inTag) {
      advance(2);
      inTag = false;
      tokens.push({ type: TokenType.SELF_CLOSE_TAG_END, loc: createLoc(startLine, startCol, startOffset) });
      continue;
    }

    // Handle Close Tag Start </
    if (char === '<' && nextChar === '/') {
      advance(2);
      inTag = true;
      tokens.push({ type: TokenType.CLOSE_TAG_START, loc: createLoc(startLine, startCol, startOffset) });
      continue;
    }

    // Handle Open Tag Start <
    if (char === '<') {
      advance(1);
      inTag = true;
      tokens.push({ type: TokenType.OPEN_TAG_START, loc: createLoc(startLine, startCol, startOffset) });
      continue;
    }

    // Handle Tag End >
    if (char === '>' && inTag) {
      advance(1);
      inTag = false;
      tokens.push({ type: TokenType.TAG_END, loc: createLoc(startLine, startCol, startOffset) });
      continue;
    }

    // Handle Equals =
    if (char === '=' && inTag) {
      advance(1);
      tokens.push({ type: TokenType.EQUALS, loc: createLoc(startLine, startCol, startOffset) });
      continue;
    }

    // Handle Whitespace in tag
    if (/\s/.test(char) && inTag) {
      advance(1);
      continue;
    }

    // Handle Strings "..." or '...' or “...” / ”...” (smart quotes)
    if ((char === '"' || char === "'" || char === '“' || char === '”') && inTag) {
      const quote = (char === '“' || char === '”') ? 'smart' : char;
      advance(1);
      let value = '';
      while (cursor < input.length) {
        const c = input[cursor];
        if (quote === 'smart' && (c === '”' || c === '“')) break;
        if (quote !== 'smart' && c === quote) break;
        value += c;
        advance(1);
      }
      if (cursor < input.length) advance(1);
      tokens.push({
        type: TokenType.STRING,
        value,
        loc: createLoc(startLine, startCol, startOffset)
      });
      continue;
    }

    // Handle Expressions { ... } (inside or outside tags)
    if (char === '{') {
      advance(1);
      let value = '';
      let braceCount = 1;
      while (cursor < input.length && braceCount > 0) {
        if (input[cursor] === '{') braceCount++;
        else if (input[cursor] === '}') braceCount--;
        if (braceCount > 0) {
          value += input[cursor];
          advance(1);
        }
      }
      if (cursor < input.length && input[cursor] === '}') {
        advance(1);
      } else {
        diagnostics.add(new MektADiagnostic({
          file: filename,
          line: startLine,
          column: startCol,
          message: 'Unclosed expression block',
          hint: 'Add "}" to close expression.',
          category: DiagnosticCategory.SYNTAX
        }));
      }
      tokens.push({
        type: TokenType.EXPRESSION,
        value: value.trim(),
        loc: createLoc(startLine, startCol, startOffset)
      });
      continue;
    }

    // Handle Identifiers inside tags
    if (inTag) {
      let identifier = '';
      while (cursor < input.length && /[a-zA-Z0-9-:@._]/.test(input[cursor])) {
        identifier += input[cursor];
        advance(1);
      }
      if (identifier) {
        tokens.push({
          type: TokenType.IDENTIFIER,
          value: identifier,
          loc: createLoc(startLine, startCol, startOffset)
        });
        continue;
      }
    }

    // Handle Text outside tags
    if (!inTag) {
      let text = '';
      while (cursor < input.length && input[cursor] !== '<' && input[cursor] !== '{') {
        text += input[cursor];
        advance(1);
      }
      if (text) {
        tokens.push({
          type: TokenType.TEXT,
          value: text,
          loc: createLoc(startLine, startCol, startOffset)
        });
      }
      continue;
    }

    advance(1);
  }

  tokens.push({ type: TokenType.EOF, loc: createLoc(line, column, cursor) });
  return tokens;
}

/**
 * Parses tokens into AST ProgramNode.
 */
export function parse(tokens, filename = 'unknown.mek', diagnostics = new DiagnosticsBag()) {
  let current = 0;

  function peek() {
    return tokens[current] || { type: TokenType.EOF };
  }

  function advance() {
    const token = tokens[current];
    current++;
    return token;
  }

  function parseAttributes() {
    const attrs = [];
    while (
      current < tokens.length &&
      peek().type !== TokenType.TAG_END &&
      peek().type !== TokenType.SELF_CLOSE_TAG_END &&
      peek().type !== TokenType.EOF
    ) {
      const tok = peek();
      if (tok.type === TokenType.IDENTIFIER) {
        const attrTok = advance();
        const attrName = attrTok.value;
        let attrValue = true;
        let isExpression = false;

        if (peek().type === TokenType.EQUALS) {
          advance(); // skip =
          const valTok = peek();
          if (valTok.type === TokenType.STRING) {
            attrValue = advance().value;
          } else if (valTok.type === TokenType.EXPRESSION) {
            attrValue = advance().value;
            isExpression = true;
          } else if (valTok.type === TokenType.IDENTIFIER) {
            attrValue = advance().value;
          }
        }

        if (attrName.startsWith('m-on:')) {
          const eventName = attrName.replace('m-on:', '');
          attrs.push(new EventDirectiveNode(eventName, attrValue, attrTok.loc));
        } else {
          attrs.push(new AttributeNode(attrName, attrValue, isExpression, attrTok.loc));
        }
      } else {
        advance();
      }
    }
    return attrs;
  }

  function parseElementOrDirective() {
    const openTok = advance(); // OPEN_TAG_START
    const tagTok = peek();

    if (tagTok.type !== TokenType.IDENTIFIER) {
      diagnostics.add(new MektADiagnostic({
        file: filename,
        line: openTok.loc.start.line,
        column: openTok.loc.start.column,
        message: 'Expected tag name after "<"',
        category: DiagnosticCategory.SYNTAX
      }));
      return null;
    }

    const tag = advance().value;
    const attributes = parseAttributes();

    let isSelfClosing = false;
    if (peek().type === TokenType.SELF_CLOSE_TAG_END) {
      advance();
      isSelfClosing = true;
    } else if (peek().type === TokenType.TAG_END) {
      advance();
    }

    // Children parsing
    const children = [];
    if (!isSelfClosing) {
      while (
        current < tokens.length &&
        peek().type !== TokenType.CLOSE_TAG_START &&
        peek().type !== TokenType.EOF
      ) {
        const child = parseNode();
        if (child) children.push(child);
      }

      if (peek().type === TokenType.CLOSE_TAG_START) {
        advance(); // skip </
        const closeTagTok = peek();
        if (closeTagTok.type === TokenType.IDENTIFIER) {
          const closeTag = advance().value;
          if (closeTag !== tag) {
            diagnostics.add(new MektADiagnostic({
              file: filename,
              line: closeTagTok.loc.start.line,
              column: closeTagTok.loc.start.column,
              message: `Mismatched closing tag </${closeTag}> for open tag <${tag}>`,
              hint: `Change </${closeTag}> to </${tag}>`,
              category: DiagnosticCategory.SYNTAX
            }));
          }
        }
        if (peek().type === TokenType.TAG_END) advance();
      } else {
        diagnostics.add(new MektADiagnostic({
          file: filename,
          line: openTok.loc.start.line,
          column: openTok.loc.start.column,
          message: `Unclosed tag <${tag}>`,
          hint: `Add </${tag}> after element.`,
          category: DiagnosticCategory.SYNTAX
        }));
      }
    }

    // Categorize node type
    const loc = openTok.loc;

    if (tag === 'page') {
      const titleAttr = attributes.find(a => a.name === 'title');
      const layoutAttr = attributes.find(a => a.name === 'layout');
      const title = titleAttr ? String(titleAttr.value) : '';
      const layout = layoutAttr ? String(layoutAttr.value) : null;
      return new PageNode(title, layout, {}, children, loc);
    }

    if (tag === 'layout') {
      const nameAttr = attributes.find(a => a.name === 'name');
      const name = nameAttr ? String(nameAttr.value) : 'default';
      return new LayoutNode(name, children, loc);
    }

    if (tag === 'slot') {
      const nameAttr = attributes.find(a => a.name === 'name');
      const name = nameAttr ? String(nameAttr.value) : 'default';
      return new SlotNode(name, children, loc);
    }

    if (tag === 'if') {
      const condAttr = attributes.find(a => a.name === 'condition' || a.name === 'test');
      const test = condAttr ? String(condAttr.value) : 'true';

      // Lookahead for optional <else> or <else-if>
      let alternate = null;
      if (peek().type === TokenType.OPEN_TAG_START) {
        const nextIdx = current + 1;
        if (tokens[nextIdx] && tokens[nextIdx].type === TokenType.IDENTIFIER && tokens[nextIdx].value === 'else') {
          alternate = parseElementOrDirective();
        }
      }

      return new ConditionalNode(test, children, alternate, loc);
    }

    if (tag === 'else') {
      return new FragmentNode(children, loc);
    }

    if (tag === 'for') {
      const itemAttr = attributes.find(a => a.name === 'item');
      const inAttr = attributes.find(a => a.name === 'in' || a.name === 'of');
      const item = itemAttr ? String(itemAttr.value) : 'item';
      const iterable = inAttr ? String(inAttr.value) : '[]';
      return new LoopNode(item, iterable, children, null, loc);
    }

    // Component check: uppercase first letter or custom component
    const isComponent = /^[A-Z]/.test(tag);
    if (isComponent) {
      return new ComponentNode(tag, attributes, children, {}, loc);
    }

    return new ElementNode(tag, attributes, children, isSelfClosing, loc);
  }

  function parseNode() {
    const tok = peek();

    if (tok.type === TokenType.COMMENT) {
      advance();
      return new CommentNode(tok.value, tok.loc);
    }

    if (tok.type === TokenType.TEXT) {
      advance();
      if (!tok.value.trim()) return null;
      return new TextNode(tok.value, tok.loc);
    }

    if (tok.type === TokenType.EXPRESSION) {
      advance();
      return new ExpressionNode(tok.value, tok.loc);
    }

    if (tok.type === TokenType.FRAGMENT_START) {
      const fragTok = advance();
      const children = [];
      while (
        current < tokens.length &&
        peek().type !== TokenType.FRAGMENT_END &&
        peek().type !== TokenType.EOF
      ) {
        const child = parseNode();
        if (child) children.push(child);
      }
      if (peek().type === TokenType.FRAGMENT_END) advance();
      return new FragmentNode(children, fragTok.loc);
    }

    if (tok.type === TokenType.OPEN_TAG_START) {
      return parseElementOrDirective();
    }

    advance();
    return null;
  }

  const imports = [];
  const exports = [];
  const scripts = [];
  const styles = [];
  const body = [];

  while (current < tokens.length && peek().type !== TokenType.EOF) {
    const tok = peek();

    if (tok.type === TokenType.SCRIPT_BLOCK) {
      advance();
      scripts.push(new ScriptNode(tok.content, tok.lang, tok.boundary, tok.loc));
      continue;
    }

    if (tok.type === TokenType.STYLE_BLOCK) {
      advance();
      styles.push(new StyleNode(tok.content, tok.scoped, tok.loc));
      continue;
    }

    const node = parseNode();
    if (node) body.push(node);
  }

  return new ProgramNode(body, imports, exports, scripts, styles);
}
