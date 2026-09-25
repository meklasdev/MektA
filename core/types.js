import { MektADiagnostic, DiagnosticCategory, DiagnosticSeverity } from './diagnostics.js';

let ts = null;
try {
  const tsModule = await import('typescript');
  ts = tsModule.default || tsModule;
} catch {
  // TypeScript optional fallback
}

/**
 * Checks TypeScript script blocks and component expressions.
 * @param {import('./ast/nodes.js').ProgramNode} ast
 * @param {string} filename
 * @param {import('./diagnostics.js').DiagnosticsBag} diagnostics
 */
export function checkTypes(ast, filename = 'unknown.mek', diagnostics) {
  if (!ts || !ts.ScriptTarget) return;

  const scriptContents = ast.scripts ? ast.scripts.map(s => s.content).join('\n') : '';
  if (!scriptContents) return;

  const virtualFileName = filename.replace(/\.mek$/, '.ts');

  const compilerOptions = {
    target: ts.ScriptTarget.ES2022 || ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX || ts.JsxEmit.React,
    strict: false,
    noEmit: true,
    skipLibCheck: true
  };

  const virtualSourceFile = ts.createSourceFile(
    virtualFileName,
    scriptContents,
    ts.ScriptTarget.ES2022 || ts.ScriptTarget.ES2020,
    true
  );

  const defaultHost = ts.createCompilerHost(compilerOptions);
  const customHost = {
    ...defaultHost,
    getSourceFile: (fileName, languageVersion) => {
      if (fileName === virtualFileName) return virtualSourceFile;
      return defaultHost.getSourceFile(fileName, languageVersion);
    },
    fileExists: (fileName) => fileName === virtualFileName || defaultHost.fileExists(fileName),
    readFile: (fileName) => fileName === virtualFileName ? scriptContents : defaultHost.readFile(fileName)
  };

  const program = ts.createProgram([virtualFileName], compilerOptions, customHost);
  const tsDiagnostics = ts.getPreEmitDiagnostics(program, virtualSourceFile);

  for (const diag of tsDiagnostics) {
    if (diag.file) {
      const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start || 0);
      const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');

      diagnostics.add(new MektADiagnostic({
        file: filename,
        line: line + 1,
        column: character + 1,
        message: `TypeScript Error: ${message}`,
        category: DiagnosticCategory.TYPE,
        severity: DiagnosticSeverity.ERROR
      }));
    }
  }
}

/**
 * Generates TypeScript declaration file content for a .mek component.
 */
export function generateDts(componentName, props = {}) {
  const propTypes = Object.entries(props)
    .map(([key, val]) => `    ${key}?: ${typeof val === 'string' ? 'string' : 'any'};`)
    .join('\n');

  return `declare module '*.mek' {
  import React from 'react';

  export interface ${componentName}Props {
${propTypes}
    children?: React.ReactNode;
  }

  const ${componentName}: React.FC<${componentName}Props>;
  export default ${componentName};
}
`;
}
