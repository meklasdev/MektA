import assert from 'node:assert/strict';
import { Router } from '../core/router.js';

console.log('Testing Router Engine...');

const router = new Router('pages');
router.scanRoutes(process.cwd());

const home = router.resolve('/');
assert.ok(home !== null);
assert.ok(home.file.includes('index'));

const dynamicMatch = router.resolve('/123');
if (dynamicMatch) {
  assert.equal(dynamicMatch.params.id, '123');
}

console.log('✔ Router test passed!');
