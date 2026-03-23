/**
 * Mekta Network Utilities
 * High-fidelity network fetchers with built-in status management
 */
export const Network = {
  get: async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Network: ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error(`Mekta Net Error: ${err.message}`);
      throw err;
    }
  },

  post: async (url, body, options = {}) => {
    return Network.get(url, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: JSON.stringify(body)
    });
  }
};
