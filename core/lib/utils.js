/**
 * Mekta Project Utilities
 * Professional string, date, and array helpers
 */
export const Utils = {
  formatDate: (date) => new Intl.DateTimeFormat('en-US').format(date),
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  uniqueId: () => Math.random().toString(36).substr(2, 9),
  slugify: (text) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
  randomColor: () => '#' + Math.floor(Math.random()*16777215).toString(16)
};
