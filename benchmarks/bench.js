import { compile } from '../core/compiler.js';
import { performance } from 'perf_hooks';

console.log('Running MektA Compiler Benchmarks...\n');

const sampleMek = `<script lang="ts">
  let user = { name: "Architect" };
</script>
<page title="Benchmark Test">
  <section class="hero">
    <heading>Welcome, {user.name}</heading>
    <button m-on:click={save}>Save</button>
  </section>
  <for item={item} in={items}>
    <card key={item.id}>{item.title}</card>
  </for>
</page>`;

const iterations = 1000;
const start = performance.now();

for (let i = 0; i < iterations; i++) {
  compile(sampleMek, { target: 'react', cache: false });
}

const end = performance.now();
const totalTime = end - start;
const avgTime = totalTime / iterations;

console.log(`Executed ${iterations} compilations in ${totalTime.toFixed(2)}ms`);
console.log(`Average compilation time: ${avgTime.toFixed(4)}ms per file`);
console.log(`Throughput: ${(1000 / avgTime).toFixed(2)} compilations/sec`);
