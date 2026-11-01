export type AgentProviderKind = "opencode" | "openai" | "anthropic" | "gemini" | "ollama" | "custom";
export type AgentTaskStatus = "queued" | "running" | "blocked" | "completed" | "failed";

export type AgentProvider = {
  id: string;
  name: string;
  kind: AgentProviderKind;
  model: string;
  endpoint: string;
  apiKeyEnv: string;
  enabled: boolean;
  createdAt: string;
};

export type AgentTask = {
  id: string;
  title: string;
  role: string;
  prompt: string;
  providerId: string;
  status: AgentTaskStatus;
  dependsOn: string[];
  output: string;
  createdAt: string;
  updatedAt: string;
};

export type OrchestrationSnapshot = { providers: AgentProvider[]; tasks: AgentTask[] };

const storageKey = "mekta.orchestration.v1";

export function emptyOrchestration(): OrchestrationSnapshot {
  return { providers: [], tasks: [] };
}

export async function loadOrchestration(): Promise<OrchestrationSnapshot> {
  const raw = typeof window !== "undefined" && window.mekta
    ? await window.mekta.loadOrchestration()
    : typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem(storageKey) || "null") as unknown : null;
  if (!raw || typeof raw !== "object") return emptyOrchestration();
  const value = raw as Partial<OrchestrationSnapshot>;
  return { providers: Array.isArray(value.providers) ? value.providers : [], tasks: Array.isArray(value.tasks) ? value.tasks : [] };
}

export async function saveOrchestration(snapshot: OrchestrationSnapshot): Promise<void> {
  if (typeof window !== "undefined" && window.mekta) await window.mekta.saveOrchestration(snapshot);
  else if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
}

export function createId(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}
