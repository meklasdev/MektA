/**
 * MektA Language Server Protocol Implementation
 */
import { tokenize, parse } from '../../core/parser.js';
import { lintMek } from '../../core/linter.js';
import { formatMek } from '../../core/formatter.js';

export class MektALanguageServer {
  constructor() {
    this.documents = new Map();
  }

  onDocumentChange(uri, content) {
    this.documents.set(uri, content);
    return this.provideDiagnostics(uri, content);
  }

  provideDiagnostics(uri, content) {
    const diagnostics = lintMek(content, uri);
    return diagnostics.toJSON();
  }

  provideCompletion(uri, position) {
    return [
      { label: '<page>', kind: 'Snippet', insertText: '<page title="${1:Title}">\n  $0\n</page>' },
      { label: '<if>', kind: 'Snippet', insertText: '<if condition={${1:condition}}>\n  $0\n</if>' },
      { label: '<for>', kind: 'Snippet', insertText: '<for item={${1:item}} in={${2:list}}>\n  $0\n</for>' },
      { label: '<button>', kind: 'Snippet', insertText: '<button m-on:click={${1:handleClick}}>\n  $0\n</button>' }
    ];
  }

  provideFormatting(uri) {
    const content = this.documents.get(uri);
    if (!content) return null;
    return formatMek(content);
  }
}
