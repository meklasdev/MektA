# Mekta Standard Library (core/lib/)

Mekta provides a set of high-fidelity utility modules for managing state, animations, DOM, and networking across all targets (React, HTML, PHP).

## 1. State Management (state.js)
Reactive state for .mek components.
```javascript
import { createState } from 'mekta/core/lib/state';
const count = createState(0);
count.subscribe((v) => console.log('Count:', v));
count.set(1);
```

## 2. Animation Bridge (anim.js)
Simplified interface for GSAP and CSS animations.
```javascript
import { Animation } from 'mekta/core/lib/anim';
Animation.to('#hero', { opacity: 1, duration: 1 });
```

## 3. DOM Helpers (dom.js)
Utilities for direct DOM manipulation in custom targets.
```javascript
import { DOM } from 'mekta/core/lib/dom';
const el = DOM.select('.active');
DOM.addClass(el, 'highlight');
```

## 4. Network Utilities (net.js)
High-fidelity fetchers with status management.
```javascript
import { Network } from 'mekta/core/lib/net';
const data = await Network.get('https://api.mekta.io/v1/presets');
```

---
[Back Home](../index.html)
