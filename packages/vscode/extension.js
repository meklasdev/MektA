import { MektALanguageServer } from './server.js';

export function activate(context) {
  const server = new MektALanguageServer();
  console.log('[MektA VS Code Extension] Language Server active.');
  return { server };
}

export function deactivate() {}
