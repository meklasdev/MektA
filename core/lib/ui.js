/**
 * Mekta UI Components Library
 * Reusable components for .mek UI generation
 */
export const UI = {
  Navbar: (props) => `<nav class="mekta-nav">${props.children}</nav>`,
  Sidebar: (props) => `<aside class="mekta-sidebar">${props.children}</aside>`,
  Card: (props) => `<div class="mekta-card"><h3>${props.title}</h3>${props.children}</div>`,
  Modal: (props) => `<div class="mekta-modal">${props.children}</div>`,
  Button: (props) => `<button class="mekta-btn" color="${props.color || 'purple'}">${props.children}</button>`,
  Input: (props) => `<input class="mekta-input" placeholder="${props.placeholder || ''}" />`
};
