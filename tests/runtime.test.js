import assert from 'node:assert/strict';
import { createElement, getHydrationScript } from '../runtime/runtime.js';

console.log('Testing Runtime Engine...');

const element = createElement('page', { id: 'root' }, 'Hello MektA');
assert.ok(element !== null);
assert.equal(element.type, 'div');

const script = getHydrationScript({ user: 'MektA' });
assert.ok(script.includes('window.__MEKTA_STATE__'));

console.log('✔ Runtime test passed!');
