import assert from 'node:assert/strict';
import { compile } from '../core/compiler.js';
import { createElement } from '../runtime/runtime.js';
import { renderToString } from 'react-dom/server';
import React from 'react';
import vm from 'vm';

console.log('Testing Compiler Pipeline Engine & SSR Execution...');

const sampleMek = `<script lang="ts">
  let loading = false;
</script>

<style>
  button { color: blue; }
</style>

<page title="Dashboard">
  <heading>Welcome</heading>
  <button m-on:click={openSettings} m-disabled={loading}>Settings</button>
  <if condition={user.loggedIn}>
    <Dashboard />
  </if>
  <for item={project} in={projects}>
    <ProjectCard project={project} />
  </for>
</page>`;

// 1. React ESM Target Compilation
const reactResult = compile(sampleMek, { target: 'react', filename: 'pages/dashboard.mek', moduleFormat: 'esm' });
assert.ok(reactResult.js.includes('createElement("h1"')); // heading normalized to h1
assert.ok(reactResult.js.includes('onClick: openSettings'));
assert.ok(reactResult.js.includes('disabled: loading'));
assert.ok(reactResult.js.includes('export default function Component'));
assert.equal(reactResult.css.trim(), 'button { color: blue; }');

// 2. React CJS Target & VM Execution
const cjsResult = compile(sampleMek, { target: 'react', filename: 'pages/dashboard.mek', moduleFormat: 'cjs' });
const moduleObj = { exports: {} };
const context = {
  require: (mod) => (mod === 'react' ? React : {}),
  module: moduleObj,
  exports: moduleObj.exports,
  createElement,
  React: { createElement },
  user: { loggedIn: true },
  projects: [{ id: 1 }],
  openSettings: () => {},
  loading: false
};
vm.createContext(context);
vm.runInContext(cjsResult.js, context);
const Component = moduleObj.exports;
assert.equal(typeof Component, 'function');
const ssrHtml = renderToString(createElement(Component, {}));
assert.ok(ssrHtml.includes('<h1>Welcome</h1>'));

// 3. Static HTML Target Compilation
const htmlResult = compile(sampleMek, { target: 'html', filename: 'pages/dashboard.mek' });
assert.ok(htmlResult.js.includes('<h1>Welcome</h1>'));
assert.ok(htmlResult.js.includes('<button>Settings</button>'));

console.log('✔ Compiler pipeline & SSR execution test passed!');
