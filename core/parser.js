/**
 * Enhanced Tokenizer for .mek files
 * Supports self-closing tags and comments.
 */
export function tokenize(input) {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    const char = input[cursor];

    // Handle Comments <!-- -->
    if (char === '<' && input.slice(cursor, cursor + 4) === '<!--') {
      let comment = '';
      cursor += 4;
      while (cursor < input.length && input.slice(cursor, cursor + 3) !== '-->') {
        comment += input[cursor];
        cursor += 1;
      }
      cursor += 3;
      tokens.push({ type: 'COMMENT', value: comment.trim() });
      continue;
    }

    if (char === '<') {
      if (input[cursor + 1] === '/') {
        tokens.push({ type: 'CLOSE_TAG_START', value: '</' });
        cursor += 2;
      } else {
        tokens.push({ type: 'OPEN_TAG_START', value: '<' });
        cursor += 1;
      }
      continue;
    }

    if (char === '/' && input[cursor + 1] === '>') {
      tokens.push({ type: 'SELF_CLOSE_TAG_END', value: '/>' });
      cursor += 2;
      continue;
    }

    if (char === '>') {
      tokens.push({ type: 'TAG_END', value: '>' });
      cursor += 1;
      continue;
    }

    if (char === '=') {
      tokens.push({ type: 'EQUALS', value: '=' });
      cursor += 1;
      continue;
    }

    if (/\s/.test(char)) {
      cursor += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      let value = '';
      cursor += 1;
      while (cursor < input.length && input[cursor] !== quote) {
        value += input[cursor];
        cursor += 1;
      }
      cursor += 1;
      tokens.push({ type: 'STRING', value });
      continue;
    }

    // Match identifiers or text
    const lastToken = tokens[tokens.length - 1];
    const isInsideTag = lastToken && (
      lastToken.type === 'OPEN_TAG_START' ||
      lastToken.type === 'CLOSE_TAG_START' ||
      lastToken.type === 'IDENTIFIER' ||
      lastToken.type === 'EQUALS'
    );

    if (isInsideTag) {
      let identifier = '';
      while (cursor < input.length && /[a-zA-Z0-9-]/.test(input[cursor])) {
        identifier += input[cursor];
        cursor += 1;
      }
      if (identifier) {
        tokens.push({ type: 'IDENTIFIER', value: identifier });
        continue;
      }
    } else {
      let text = '';
      while (cursor < input.length && input[cursor] !== '<') {
        text += input[cursor];
        cursor += 1;
      }
      if (text.trim()) {
        tokens.push({ type: 'TEXT', value: text.trim() });
      }
      continue;
    }

    cursor++;
  }

  return tokens;
}

/**
 * Enhanced Recursive Descent Parser for .mek AST
 */
export function parse(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (!token) return null;

    if (token.type === 'COMMENT') {
      current++;
      return { type: 'CommentNode', value: token.value };
    }

    if (token.type === 'TEXT') {
      current++;
      return { type: 'TextNode', value: token.value };
    }

    if (token.type === 'OPEN_TAG_START') {
      token = tokens[++current]; // tag name
      const node = {
        type: 'Element',
        tag: token.value,
        props: {},
        children: [],
      };
      current++;

      // Parse Attributes
      while (current < tokens.length &&
             tokens[current].type !== 'TAG_END' &&
             tokens[current].type !== 'SELF_CLOSE_TAG_END') {
        token = tokens[current];
        if (token.type === 'IDENTIFIER') {
          const name = token.value;
          current++;
          if (tokens[current] && tokens[current].type === 'EQUALS') {
            current++;
            node.props[name] = tokens[current].value;
            current++;
          } else {
            node.props[name] = true;
          }
        } else {
          current++;
        }
      }

      if (tokens[current] && tokens[current].type === 'SELF_CLOSE_TAG_END') {
        current++;
        return node;
      }

      current++; // TAG_END

      // Parse Children
      while (current < tokens.length && tokens[current].type !== 'CLOSE_TAG_START') {
        const child = walk();
        if (child) node.children.push(child);
      }

      if (tokens[current] && tokens[current].type === 'CLOSE_TAG_START') {
        current++; // Skip </
        current++; // Skip tag name
        current++; // Skip >
      }

      return node;
    }

    if (token.type === 'CLOSE_TAG_START') {
        return null;
    }

    current++;
    return null;
  }

  const ast = { type: 'Program', body: [] };
  while (current < tokens.length) {
    const node = walk();
    if (node) ast.body.push(node);
  }
  return ast;
}
