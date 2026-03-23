/**
 * Mekta DOM Helpers
 * Utilities for direct DOM manipulation in custom targets
 */
export const DOM = {
  select: (selector) => document.querySelector(selector),
  selectAll: (selector) => document.querySelectorAll(selector),

  addClass: (el, className) => el.classList.add(className),
  removeClass: (el, className) => el.classList.remove(className),

  on: (el, event, handler) => el.addEventListener(event, handler),
  off: (el, event, handler) => el.removeEventListener(event, handler),

  create: (tag, props = {}) => {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }
};
