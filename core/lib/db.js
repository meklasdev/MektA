/**
 * Mekta DB Abstraction Layer
 * Mock database interface for Agentic data handling
 */
export const DB = {
  data: {},
  save: (key, value) => {
    DB.data[key] = value;
    return true;
  },
  find: (key) => DB.data[key] || null,
  delete: (key) => {
    delete DB.data[key];
    return true;
  },
  all: () => DB.data
};
