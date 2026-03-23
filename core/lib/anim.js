/**
 * Mekta Animation Bridge
 * Simplified interface for GSAP and CSS animations
 */
export const Animation = {
  to: (selector, options) => {
    // Check for GSAP addon global
    if (typeof gsap !== 'undefined') {
      return gsap.to(selector, options);
    }
    // Fallback to basic CSS transition
    const el = document.querySelector(selector);
    if (el) {
      Object.entries(options).forEach(([k, v]) => {
        el.style[k] = typeof v === 'number' ? `${v}px` : v;
      });
    }
  },

  fadeIn: (selector, duration = 500) => {
    Animation.to(selector, { opacity: 1, duration: duration / 1000 });
  },

  fadeOut: (selector, duration = 500) => {
    Animation.to(selector, { opacity: 0, duration: duration / 1000 });
  }
};
