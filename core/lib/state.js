/**
 * Mekta State Management
 * Lightweight reactive state for .mek components
 */
export function createState(initialValue) {
  let value = initialValue;
  const listeners = new Set();

  return {
    get: () => value,
    set: (newValue) => {
      value = newValue;
      listeners.forEach(l => l(value));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

export function useMektaState(state) {
  // Mock hook for Mekta runtime
  return [state.get(), state.set];
}
