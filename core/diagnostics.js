import chalk from 'chalk';

export const DiagnosticSeverity = {
  ERROR: 'Error',
  WARNING: 'Warning',
  INFO: 'Info'
};

export const DiagnosticCategory = {
  SYNTAX: 'Syntax',
  TYPE: 'Type',
  IMPORT: 'Import',
  PROP: 'Prop',
  DIRECTIVE: 'Directive',
  ROUTING: 'Routing',
  COMPILER: 'Compiler'
};

export class MektADiagnostic {
  constructor({
    file = 'unknown.mek',
    line = 1,
    column = 1,
    endLine,
    endColumn,
    message,
    hint = null,
    severity = DiagnosticSeverity.ERROR,
    category = DiagnosticCategory.SYNTAX,
    code = null
  }) {
    this.file = file;
    this.line = line;
    this.column = column;
    this.endLine = endLine || line;
    this.endColumn = endColumn || (column + 1);
    this.message = message;
    this.hint = hint;
    this.severity = severity;
    this.category = category;
    this.code = code;
  }

  /**
   * Formats diagnostic for CLI display with code snippet visual frame.
   * @param {string} [sourceCode='']
   * @returns {string}
   */
  formatTerminal(sourceCode = '') {
    const isError = this.severity === DiagnosticSeverity.ERROR;
    const icon = isError ? chalk.red('✖') : chalk.yellow('⚠');
    const headerColor = isError ? chalk.red.bold : chalk.yellow.bold;

    let output = `${icon} ${headerColor(`MektA ${this.category.toLowerCase()} ${this.severity.toLowerCase()}`)}\n`;
    output += chalk.gray(`  ${this.file}:${this.line}:${this.column}\n`);

    if (sourceCode) {
      const lines = sourceCode.split('\n');
      const startLine = Math.max(1, this.line - 2);
      const endLine = Math.min(lines.length, this.line + 2);

      const maxLineNumWidth = String(endLine).length;

      for (let l = startLine; l <= endLine; l++) {
        const lineStr = String(l).padStart(maxLineNumWidth, ' ');
        const lineContent = lines[l - 1] || '';

        if (l === this.line) {
          output += chalk.gray(`  ${lineStr} │ `) + lineContent + '\n';
          const underlineLen = Math.max(1, (this.endColumn && this.endLine === this.line) ? (this.endColumn - this.column) : 1);
          const pointerIndent = ' '.repeat(Math.max(0, this.column - 1));
          const pointer = '^'.repeat(underlineLen);
          output += chalk.gray(`  ${' '.repeat(maxLineNumWidth)} │ `) + pointerIndent + chalk.red(pointer) + '\n';
        } else {
          output += chalk.gray(`  ${lineStr} │ `) + chalk.gray(lineContent) + '\n';
        }
      }
    }

    output += `  ${chalk.bold(this.message)}\n`;
    if (this.hint) {
      output += chalk.cyan(`  Hint: ${this.hint}\n`);
    }

    return output;
  }

  toJSON() {
    return {
      file: this.file,
      line: this.line,
      column: this.column,
      endLine: this.endLine,
      endColumn: this.endColumn,
      message: this.message,
      hint: this.hint,
      severity: this.severity,
      category: this.category,
      code: this.code
    };
  }
}

export class DiagnosticsBag {
  constructor() {
    this.diagnostics = [];
  }

  add(diagnostic) {
    if (diagnostic instanceof MektADiagnostic) {
      this.diagnostics.push(diagnostic);
    } else {
      this.diagnostics.push(new MektADiagnostic(diagnostic));
    }
  }

  hasErrors() {
    return this.diagnostics.some(d => d.severity === DiagnosticSeverity.ERROR);
  }

  getErrors() {
    return this.diagnostics.filter(d => d.severity === DiagnosticSeverity.ERROR);
  }

  getWarnings() {
    return this.diagnostics.filter(d => d.severity === DiagnosticSeverity.WARNING);
  }

  formatAll(sourceCode = '') {
    return this.diagnostics.map(d => d.formatTerminal(sourceCode)).join('\n');
  }

  toJSON() {
    return this.diagnostics.map(d => d.toJSON());
  }
}
