import { tokenize, parse } from './parser.js';
import { DiagnosticsBag, MektADiagnostic, DiagnosticCategory, DiagnosticSeverity } from './diagnostics.js';
import { walkAST } from './ast/nodes.js';

/**
 * Linter Engine for .mek files
 */
export function lintMek(source, filename = 'unknown.mek') {
  const diagnostics = new DiagnosticsBag();
  const tokens = tokenize(source, filename, diagnostics);
  const ast = parse(tokens, filename, diagnostics);

  walkAST(ast, {
    enter: (node) => {
      // Rule: Loop missing key attribute
      if (node.type === 'Loop') {
        const hasKey = node.children.some(c =>
          (c.type === 'Element' || c.type === 'Component') &&
          c.attributes && c.attributes.some(a => a.name === 'key')
        );
        if (!hasKey) {
          diagnostics.add(new MektADiagnostic({
            file: filename,
            line: node.loc.start.line,
            column: node.loc.start.column,
            message: 'Missing "key" attribute in <for> loop child element',
            hint: 'Add key={item.id} to top-level element inside loop.',
            severity: DiagnosticSeverity.WARNING,
            category: DiagnosticCategory.SYNTAX
          }));
        }
      }

      // Rule: Accessibility img tag missing alt
      if ((node.type === 'Element' || node.type === 'Component') && node.tag === 'img') {
        const hasAlt = node.attributes && node.attributes.some(a => a.name === 'alt');
        if (!hasAlt) {
          diagnostics.add(new MektADiagnostic({
            file: filename,
            line: node.loc.start.line,
            column: node.loc.start.column,
            message: 'Image element <img> is missing "alt" property',
            hint: 'Add alt="description" attribute for accessibility.',
            severity: DiagnosticSeverity.WARNING,
            category: DiagnosticCategory.SYNTAX
          }));
        }
      }
    }
  });

  return diagnostics;
}
