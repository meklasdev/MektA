/**
 * Mekta Robust Tokenizer (v1.4)
 * Supports line/column tracking, fragments, and comments.
 */
export function tokenize(input) {
  const tokens = [];
  let cursor = 0;
  let line = 1;
  let column = 1;

  while (cursor < input.length) {
    let char = input[cursor];

    const nextChar = input[cursor + 1];

    // Track Line/Column
    const updatePos = (str) => {
      for (const c of str) {
        if (c === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
      }
      cursor += str.length;
    };

    // Handle Comments <!-- -->
    if (char === '<' && input.slice(cursor, cursor + 4) === '<!--') {
      let value = '';
      cursor += 4;
      while (cursor < input.length && input.slice(cursor, cursor + 3) !== '-->') {
        value += input[cursor];
        updatePos(input[cursor]);
      }
      cursor += 3;
      tokens.push({ type: 'COMMENT', value: value.trim(), line, column });
      continue;
    }

    // Handle Fragment Start <>
    if (char === '<' && nextChar === '>') {
      tokens.push({ type: 'FRAGMENT_START', line, column });
      cursor += 2;
      column += 2;
      continue;
    }

    // Handle Fragment End </>
    if (char === '<' && nextChar === '/' && input[cursor + 2] === '>') {
      tokens.push({ type: 'FRAGMENT_END', line, column });
      cursor += 3;
      column += 3;
      continue;
    }

    // Handle Self-Closing />
    if (char === '/' && nextChar === '>') {
      tokens.push({ type: 'SELF_CLOSE_TAG_END', line, column });
      cursor += 2;
      column += 2;
      continue;
    }

    if (char === '<') {
      if (nextChar === '/') {
        tokens.push({ type: 'CLOSE_TAG_START', value: '</', line, column });
        cursor += 2;
        column += 2;
      } else {
        tokens.push({ type: 'OPEN_TAG_START', value: '<', line, column });
        cursor += 1;
        column += 1;
      }
      continue;
    }

    if (char === '>') {
      tokens.push({ type: 'TAG_END', value: '>', line, column });
      cursor += 1;
      column += 1;
      continue;
    }

    if (char === '=') {
      tokens.push({ type: 'EQUALS', value: '=', line, column });
      cursor += 1;
      column += 1;
      continue;
    }

    if (/\s/.test(char)) {
      updatePos(char);
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      let value = '';
      cursor += 1;
      while (cursor < input.length && input[cursor] !== quote) {
        value += input[cursor];
        updatePos(input[cursor]);
      }
      cursor += 1;
      tokens.push({ type: 'STRING', value, line, column });
      continue;
    }

    // Identify tokens based on context
    const lastToken = tokens[tokens.length - 1];
    const isInsideTag = lastToken && (
      lastToken.type === 'OPEN_TAG_START' ||
      lastToken.type === 'CLOSE_TAG_START' ||
      lastToken.type === 'IDENTIFIER' ||
      lastToken.type === 'EQUALS'
    );

    if (isInsideTag) {
      let identifier = '';
      while (cursor < input.length && /[a-zA-Z0-9-:]/.test(input[cursor])) {
        identifier += input[cursor];
        cursor += 1;
        column++;
      }
      if (identifier) {
        tokens.push({ type: 'IDENTIFIER', value: identifier, line, column });
        continue;
      }
    } else {
      let text = '';
      while (cursor < input.length && input[cursor] !== '<') {
        text += input[cursor];
        updatePos(input[cursor]);
      }
      if (text.trim()) {
        tokens.push({ type: 'TEXT', value: text.trim(), line, column });
      }
      continue;
    }

    cursor++;
    column++;
  }

  return tokens;
}

/**
 * Mekta Robust Recursive Descent Parser (v1.4)
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

    if (token.type === 'FRAGMENT_START') {
      current++;
      const node = { type: 'Fragment', children: [] };
      while (current < tokens.length && tokens[current].type !== 'FRAGMENT_END') {
        const child = walk();
        if (child) node.children.push(child);
      }
      current++; // Skip </>
      return node;
    }

    if (token.type === 'OPEN_TAG_START') {
      token = tokens[++current]; // tag name
      if (!token) throw new Error(`Expected tag name at line ${tokens[current-1].line}`);

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
        return null; // Return to parent for handling
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
