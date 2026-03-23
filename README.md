You are a senior JavaScript/TypeScript framework engineer.

Your task is to build a complete custom frontend framework called "Mekta".

Goal

Create a Node.js-based framework that introduces a custom file format ".mek", similar to JSX/TSX, which compiles into React-compatible JavaScript.

Requirements

1. Custom Language (.mek)

Design a syntax similar to JSX:

Example:
<page>
<text>Hello world</text>
<button>Click me</button>
</page>

Support:

- Nested elements
- Props (e.g. <button color="red">)
- Text nodes
- Basic expressions (optional)

---

2. Compiler (Core)

Build a compiler that:

- Reads ".mek" files
- Parses them into an AST
- Transforms AST into JavaScript

Output example:
createElement("page", null,
createElement("text", null, "Hello world"),
createElement("button", { color: "red" }, "Click me")
)

---

3. Runtime

Implement a runtime with:

function createElement(tag, props, ...children)

Make it compatible with:

- React (React.createElement)
  OR
- Custom virtual DOM

---

4. Node.js Framework

Create a backend server using Express that:

- Accepts a prompt (POST /generate)
- Uses AI (mock function) to generate ".mek" code
- Compiles ".mek" → JS
- Renders output using ReactDOMServer
- Returns HTML

---

5. File Structure

mekta/
├── core/
│   ├── compiler.js
│   ├── parser.js
│   ├── generator.js
│   ├── runtime.js
│
├── server/
│   └── server.js
│
├── cli/
│   └── index.js
│
├── examples/
│   └── app.mek

---

6. CLI Tool

Implement CLI:

mekta build app.mek
mekta dev

---

7. AI Integration (Mock)

function generateMek(prompt) {
return "<text>${prompt}</text>"
}

Make it easy to replace with real AI later.

---

8. Rendering

Use:

- React
- ReactDOMServer.renderToString()

---

9. Code Quality

- Use modern ES modules
- Keep code modular
- Add comments
- Make it runnable

---

10. Bonus (if possible)

- Watch mode (auto rebuild)
- Error handling in parser
- Basic dev logs

---

Output Format

Generate the FULL project code:

- All files
- Ready to run
- With instructions (npm install, npm run dev)

Do NOT explain too much.
Focus on working code.

This is a real framework project, not a demo.
