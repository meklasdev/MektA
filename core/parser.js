/**
 * Simple Tokenizer for .mek files
 */
export function tokenize(input) {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    const char = input[cursor];

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
    const isInsideTag = tokens.length > 0 &&
      (tokens[tokens.length - 1].type === 'OPEN_TAG_START' ||
       tokens[tokens.length - 1].type === 'CLOSE_TAG_START' ||
       tokens[tokens.length - 1].type === 'IDENTIFIER' ||
       tokens[tokens.length - 1].type === 'EQUALS');

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
 * Recursive Descent Parser for .mek AST
 */
export function parse(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === 'TEXT') {
      current++;
      return {
        type: 'TextNode',
        value: token.value,
      };
    }

    if (token.type === 'OPEN_TAG_START') {
      token = tokens[++current]; // Skip <

      const node = {
        type: 'Element',
        tag: token.value,
        props: {},
        children: [],
      };

      token = tokens[++current]; // Skip identifier

      while (token.type !== 'TAG_END') {
        if (token.type === 'IDENTIFIER') {
          const name = token.value;
          token = tokens[++current]; // Skip identifier
          if (token.type === 'EQUALS') {
            token = tokens[++current]; // Skip =
            node.props[name] = token.value;
            token = tokens[++current]; // Skip string
          } else {
            node.props[name] = true;
          }
        } else {
          current++;
        }
        token = tokens[current];
      }

      current++; // Skip >

      token = tokens[current];
      while (
        token &&
        (token.type !== 'CLOSE_TAG_START')
      ) {
        node.children.push(walk());
        token = tokens[current];
      }

      if (token && token.type === 'CLOSE_TAG_START') {
        current++; // Skip </
        token = tokens[current]; // tag name
        if (token.value !== node.tag) {
          throw new Error(`Expected closing tag for ${node.tag}, but found ${token.value}`);
        }
        current++; // Skip tag name
        current++; // Skip >
      }

      return node;
    }

    throw new TypeError(`Unknown token type: ${token.type}`);
  }

  const ast = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}
