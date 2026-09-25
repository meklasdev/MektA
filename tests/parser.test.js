import assert from 'node:assert/strict';
import { tokenize, parse } from '../core/parser.js';
import { DiagnosticsBag } from '../core/diagnostics.js';

console.log('Testing Lexer & Parser Engine...');

const sampleMek = `<script lang="ts">
  let name = "MektA";
</script>

<style>
  .hero { color: purple; }
</style>

<page title="Dashboard" layout="dashboard">
  <section class="hero">
    <heading>Welcome, {user.name}</heading>
    <button m-on:click={openSettings} m-disabled={loading}>
      Settings
    </button>
  </section>
  <if condition={user.loggedIn}>
    <Dashboard />
  </if>
  <else>
    <Login />
  </else>
  <for item={project} in={projects}>
    <ProjectCard project={project} />
  </for>
</page>`;

const diagnostics = new DiagnosticsBag();
const tokens = tokenize(sampleMek, 'test.mek', diagnostics);

assert.ok(tokens.length > 0);
assert.equal(diagnostics.hasErrors(), false);

const ast = parse(tokens, 'test.mek', diagnostics);

assert.equal(ast.type, 'Program');
assert.equal(ast.scripts.length, 1);
assert.equal(ast.styles.length, 1);
assert.equal(ast.body.length, 1);

const pageNode = ast.body[0];
assert.equal(pageNode.type, 'Page');
assert.equal(pageNode.title, 'Dashboard');
assert.equal(pageNode.layout, 'dashboard');

console.log('✔ Parser test passed!');
