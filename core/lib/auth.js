/**
 * Mekta Auth & Session Management
 * Professional session handlers for Agentic UI
 */
export const Auth = {
  session: null,
  login: (user) => {
    Auth.session = { ...user, token: 'mekta_' + Math.random().toString(36).substr(2, 9) };
    return Auth.session;
  },
  logout: () => {
    Auth.session = null;
  },
  isAuthenticated: () => Auth.session !== null,
  getUser: () => Auth.session
};
