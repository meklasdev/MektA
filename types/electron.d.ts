export {};

declare global {
  interface Window {
    mekta?: {
      runCommand: (command: string) => Promise<{ ok: boolean; output: string }>;
      runtimeStatus: () => Promise<{ installed: boolean; version: string }>;
    loadWorkspace: () => Promise<unknown>;
    saveWorkspace: (workspace: unknown) => Promise<{ ok: boolean }>;
    checkUpdates: () => Promise<{ available: boolean; version?: string | null; reason?: string }>;
    installUpdate: () => Promise<{ ok: boolean }>;
    };
  }
}
