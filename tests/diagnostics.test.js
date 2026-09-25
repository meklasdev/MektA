import assert from 'node:assert/strict';
import { MektADiagnostic, DiagnosticsBag, DiagnosticCategory, DiagnosticSeverity } from '../core/diagnostics.js';

console.log('Testing Diagnostics Engine...');

const bag = new DiagnosticsBag();
const sampleCode = `<page>
  <section class="hero">
    <heading>Welcome</heading>
    <button>Settings
  </section>
</page>`;

bag.add(new MektADiagnostic({
  file: 'pages/dashboard.mek',
  line: 4,
  column: 5,
  message: 'Unclosed tag <button>',
  hint: 'Add </button> after element.',
  category: DiagnosticCategory.SYNTAX,
  severity: DiagnosticSeverity.ERROR
}));

assert.equal(bag.hasErrors(), true);
assert.equal(bag.getErrors().length, 1);

const formatted = bag.formatAll(sampleCode);
assert.ok(formatted.includes('pages/dashboard.mek:4:5'));
assert.ok(formatted.includes('Unclosed tag <button>'));
assert.ok(formatted.includes('Hint: Add </button> after element.'));

console.log('✔ Diagnostics test passed!\n' + formatted);
