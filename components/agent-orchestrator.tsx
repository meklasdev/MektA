"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, CheckCircle2, GitBranch, Link2, Play, Plus, Save, Settings2, Sparkles, Users, X } from "lucide-react";
import { AgentProvider, AgentProviderKind, AgentTask, AgentTaskStatus, createId, emptyOrchestration, loadOrchestration, nowIso, OrchestrationSnapshot, saveOrchestration } from "../lib/orchestration";

const providerKinds: Array<{ value: AgentProviderKind; label: string; defaultModel: string }> = [
  { value: "opencode", label: "OpenCode", defaultModel: "local runtime" },
  { value: "openai", label: "OpenAI", defaultModel: "gpt-4.1" },
  { value: "anthropic", label: "Anthropic", defaultModel: "claude-sonnet-4-5" },
  { value: "gemini", label: "Google Gemini", defaultModel: "gemini-2.5-pro" },
  { value: "ollama", label: "Ollama (local)", defaultModel: "llama3.2" },
  { value: "custom", label: "Custom OpenAI-compatible", defaultModel: "" },
];

const statusStyle: Record<AgentTaskStatus, string> = { queued: "text-neutral-400", running: "text-blue-400", blocked: "text-amber-300", completed: "text-emerald-300", failed: "text-red-300" };

function ProviderIcon({ kind, size = "md" }: { kind: AgentProviderKind; size?: "sm" | "md" }) {
  const styles: Record<AgentProviderKind, { label: string; className: string }> = {
    opencode: { label: "OC", className: "border-cyan-900/70 bg-cyan-950/40 text-cyan-300" },
    openai: { label: "◎", className: "border-neutral-700 bg-neutral-900 text-neutral-200" },
    anthropic: { label: "A", className: "border-orange-900/70 bg-orange-950/30 text-orange-300" },
    gemini: { label: "✦", className: "border-blue-900/70 bg-blue-950/40 text-blue-300" },
    ollama: { label: "O", className: "border-emerald-900/70 bg-emerald-950/30 text-emerald-300" },
    custom: { label: "↗", className: "border-violet-900/70 bg-violet-950/30 text-violet-300" },
  };
  const provider = styles[kind];
  return <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-md border font-semibold ${size === "sm" ? "h-6 w-6 text-[9px]" : "h-9 w-9 text-xs"} ${provider.className}`}>{provider.label}</span>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="grid gap-1.5 text-xs"><span className="text-neutral-500">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-9 rounded-md border border-neutral-800 bg-neutral-950 px-2.5 text-sm text-neutral-100 outline-none focus:border-blue-600" /></label>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4"><section className="w-full max-w-lg rounded-lg border border-neutral-800 bg-[#111113] p-5"><div className="flex items-center justify-between"><h2 className="font-medium">{title}</h2><button onClick={onClose} className="rounded-md p-1 text-neutral-500 hover:bg-neutral-900 hover:text-white"><X className="h-4 w-4" /></button></div>{children}</section></div>;
}

export function AgentOrchestrator() {
  const [snapshot, setSnapshot] = useState<OrchestrationSnapshot>(emptyOrchestration);
  const [modal, setModal] = useState<"provider" | "task" | null>(null);
  const [providerName, setProviderName] = useState("");
  const [providerKind, setProviderKind] = useState<AgentProviderKind>("opencode");
  const [providerModel, setProviderModel] = useState("local runtime");
  const [providerEndpoint, setProviderEndpoint] = useState("");
  const [providerEnv, setProviderEnv] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskRole, setTaskRole] = useState("Implementer");
  const [taskPrompt, setTaskPrompt] = useState("");
  const [taskProvider, setTaskProvider] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { void loadOrchestration().then(setSnapshot); }, []);
  const enabledProviders = useMemo(() => snapshot.providers.filter((provider) => provider.enabled), [snapshot.providers]);

  const persist = async (next: OrchestrationSnapshot) => { setSnapshot(next); setSaving(true); await saveOrchestration(next); setSaving(false); };
  const addProvider = async () => {
    if (!providerName.trim()) return;
    const provider: AgentProvider = { id: createId(), name: providerName.trim(), kind: providerKind, model: providerModel.trim(), endpoint: providerEndpoint.trim(), apiKeyEnv: providerEnv.trim(), enabled: true, createdAt: nowIso() };
    await persist({ ...snapshot, providers: [provider, ...snapshot.providers] });
    setProviderName(""); setProviderEndpoint(""); setProviderEnv(""); setModal(null);
  };
  const addTask = async () => {
    if (!taskTitle.trim() || !taskPrompt.trim() || !taskProvider) return;
    const timestamp = nowIso();
    const task: AgentTask = { id: createId(), title: taskTitle.trim(), role: taskRole.trim() || "Agent", prompt: taskPrompt.trim(), providerId: taskProvider, status: "queued", dependsOn: [], output: "", createdAt: timestamp, updatedAt: timestamp };
    await persist({ ...snapshot, tasks: [task, ...snapshot.tasks] });
    setTaskTitle(""); setTaskPrompt(""); setModal(null);
  };
  const removeProvider = async (id: string) => await persist({ ...snapshot, providers: snapshot.providers.filter((provider) => provider.id !== id), tasks: snapshot.tasks.filter((task) => task.providerId !== id) });
  const updateTask = async (id: string, status: AgentTaskStatus, output = "") => await persist({ ...snapshot, tasks: snapshot.tasks.map((task) => task.id === id ? { ...task, status, output, updatedAt: nowIso() } : task) });
  const queueAll = async () => await persist({ ...snapshot, tasks: snapshot.tasks.map((task) => task.status === "blocked" ? task : { ...task, status: "queued", updatedAt: nowIso() }) });

  return <div className="grid gap-5">
    <section className="rounded-lg border border-neutral-800 bg-[#111113] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg border border-blue-900/60 bg-blue-950/30"><Users className="h-5 w-5 text-blue-400" /></div><div><h2 className="font-medium">Agent orchestration</h2><p className="mt-1 max-w-xl text-sm leading-6 text-neutral-500">Split a project task between specialized agents and keep each provider isolated. Credentials are referenced by environment variable name and are never written to workspace JSON.</p></div></div><div className="flex gap-2"><button onClick={() => setModal("provider")} className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-800 px-3 text-sm text-neutral-300 hover:bg-neutral-900"><Link2 className="h-4 w-4" />Connect AI</button><button onClick={() => setModal("task")} disabled={!enabledProviders.length} className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"><Plus className="h-4 w-4" />Add task</button></div></div>
      {saving ? <p className="mt-4 flex items-center gap-2 text-xs text-neutral-600"><Save className="h-3.5 w-3.5" />Saving local orchestration state…</p> : null}
    </section>

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-lg border border-neutral-800 bg-[#111113]"><div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4"><div><h2 className="font-medium">Task board</h2><p className="mt-1 text-sm text-neutral-500">Queued work is ready for a real provider runner.</p></div><button onClick={() => void queueAll()} disabled={!snapshot.tasks.length} className="inline-flex h-8 items-center gap-2 rounded-md border border-neutral-800 px-2.5 text-xs text-neutral-400 hover:bg-neutral-900 disabled:opacity-40"><GitBranch className="h-3.5 w-3.5" />Queue all</button></div>{snapshot.tasks.length === 0 ? <div className="grid place-items-center px-6 py-16 text-center"><Sparkles className="h-6 w-6 text-neutral-700" /><p className="mt-4 text-sm text-neutral-400">No agent tasks yet</p><p className="mt-2 max-w-sm text-sm leading-6 text-neutral-600">Connect a provider, then split a real project brief into focused tasks.</p></div> : <div className="divide-y divide-neutral-900">{snapshot.tasks.map((task) => { const provider = snapshot.providers.find((item) => item.id === task.providerId); return <div key={task.id} className="p-5"><div className="flex items-start gap-3"><div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-neutral-800 bg-neutral-950"><Bot className="h-4 w-4 text-neutral-500" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-medium">{task.title}</h3><span className={"text-xs capitalize " + statusStyle[task.status]}>{task.status}</span></div><p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-600"><ProviderIcon kind={provider?.kind || "custom"} size="sm" />{task.role} · {provider?.name || "Unknown provider"} · {provider?.model || "no model"}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-400">{task.prompt}</p>{task.output ? <pre className="mt-3 overflow-auto rounded-md border border-neutral-800 bg-black p-3 text-xs text-neutral-500">{task.output}</pre> : null}</div><div className="flex shrink-0 gap-1"><button onClick={() => void updateTask(task.id, "running")} className="rounded-md p-2 text-neutral-500 hover:bg-neutral-900 hover:text-blue-300" title="Mark running"><Play className="h-4 w-4" /></button><button onClick={() => void updateTask(task.id, "completed", "Marked complete from the workspace.")} className="rounded-md p-2 text-neutral-500 hover:bg-neutral-900 hover:text-emerald-300" title="Mark completed"><CheckCircle2 className="h-4 w-4" /></button></div></div></div>; })}</div>}</section>
      <section className="rounded-lg border border-neutral-800 bg-[#111113]"><div className="border-b border-neutral-800 px-5 py-4"><h2 className="font-medium">Connected providers</h2><p className="mt-1 text-sm text-neutral-500">{enabledProviders.length} enabled · secrets stay outside the renderer.</p></div>{snapshot.providers.length === 0 ? <div className="p-5 text-sm leading-6 text-neutral-600">No provider configured. OpenCode, hosted APIs and local Ollama can be added here.</div> : <div className="divide-y divide-neutral-900">{snapshot.providers.map((provider) => <div key={provider.id} className="flex items-start gap-3 p-4"><ProviderIcon kind={provider.kind} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{provider.name}</p><p className="mt-1 truncate text-xs capitalize text-neutral-600">{provider.kind} · {provider.model || "custom model"}</p><p className="mt-1 truncate text-[11px] text-neutral-700">{provider.apiKeyEnv ? `env: ${provider.apiKeyEnv}` : provider.kind === "opencode" || provider.kind === "ollama" ? "local credentials" : "API key not mapped"}</p></div><button onClick={() => void removeProvider(provider.id)} className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-900 hover:text-red-300"><X className="h-3.5 w-3.5" /></button></div>)}</div>}</section>
    </div>

    {modal === "provider" ? <Modal title="Connect an AI provider" onClose={() => setModal(null)}><div className="mt-6 grid gap-4"><Field label="Display name" value={providerName} onChange={setProviderName} placeholder="e.g. Local OpenCode" /><label className="grid gap-1.5 text-xs"><span className="text-neutral-500">Provider</span><select value={providerKind} onChange={(event) => { const next = event.target.value as AgentProviderKind; setProviderKind(next); setProviderModel(providerKinds.find((kind) => kind.value === next)?.defaultModel || ""); }} className="h-9 rounded-md border border-neutral-800 bg-neutral-950 px-2.5 text-sm text-neutral-100 outline-none focus:border-blue-600">{providerKinds.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}</select></label><Field label="Model" value={providerModel} onChange={setProviderModel} placeholder="Model identifier" /><Field label="Endpoint (optional)" value={providerEndpoint} onChange={setProviderEndpoint} placeholder="https://api.example.com/v1" /><Field label="API key environment variable" value={providerEnv} onChange={setProviderEnv} placeholder="OPENAI_API_KEY" /><div className="flex items-start gap-2 rounded-md border border-neutral-800 bg-neutral-950 p-3 text-xs leading-5 text-neutral-500"><Settings2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />MektA stores only this reference, never the secret itself. The provider runner will resolve the variable from the desktop environment.</div><button onClick={() => void addProvider()} className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-500"><Plus className="h-4 w-4" />Save provider</button></div></Modal> : null}
    {modal === "task" ? <Modal title="Split a task between agents" onClose={() => setModal(null)}><div className="mt-6 grid gap-4"><Field label="Task title" value={taskTitle} onChange={setTaskTitle} placeholder="e.g. Build the settings screen" /><Field label="Agent role" value={taskRole} onChange={setTaskRole} placeholder="Researcher, designer, implementer…" /><label className="grid gap-1.5 text-xs"><span className="text-neutral-500">Provider</span><select value={taskProvider} onChange={(event) => setTaskProvider(event.target.value)} className="h-9 rounded-md border border-neutral-800 bg-neutral-950 px-2.5 text-sm text-neutral-100 outline-none focus:border-blue-600"><option value="">Select provider</option>{enabledProviders.map((provider) => <option key={provider.id} value={provider.id}>{provider.name} · {provider.model}</option>)}</select></label><label className="grid gap-1.5 text-xs"><span className="text-neutral-500">Instructions</span><textarea value={taskPrompt} onChange={(event) => setTaskPrompt(event.target.value)} rows={6} placeholder="Describe one focused unit of work…" className="resize-none rounded-md border border-neutral-800 bg-neutral-950 p-2.5 text-sm text-neutral-100 outline-none focus:border-blue-600" /></label><button onClick={() => void addTask()} className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-500"><Plus className="h-4 w-4" />Add queued task</button></div></Modal> : null}
  </div>;
}
