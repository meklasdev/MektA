"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js";
import { Check, ChevronRight, CircleAlert, Code2, FolderKanban, KeyRound, LayoutDashboard, LogOut, Menu, Package, PlugZap, Plus, RefreshCw, Settings2, Terminal, Trash2, UserRound, X } from "lucide-react";
import { Toaster, toast } from "sonner";
import type { Database } from "../lib/database.types";
import { authSchema, profileSchema, projectSchema, type ProjectFormValues } from "../lib/validation";
import { createCloudWorkspaceSource, createLocalWorkspaceSource, type PluginInstallation, type Profile, type Project, type WorkspaceSource } from "../lib/workspace-source";
import { AgentOrchestrator } from "./agent-orchestrator";

type Client = ReturnType<typeof createBrowserClient<Database>>;
type View = "overview" | "projects" | "plugins" | "agents" | "settings";

function getClient(): Client | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createBrowserClient<Database>(url, key) : null;
}

function Button({ children, variant = "secondary", type = "button", onClick, disabled }: { children: React.ReactNode; variant?: "primary" | "secondary" | "danger" | "ghost"; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean }) {
  const styles = { primary: "bg-blue-600 text-white hover:bg-blue-500", secondary: "border border-neutral-800 bg-neutral-950 text-neutral-200 hover:bg-neutral-900", danger: "border border-red-900/60 text-red-300 hover:bg-red-950/30", ghost: "text-neutral-400 hover:bg-neutral-900 hover:text-white" };
  return <button type={type} onClick={onClick} disabled={disabled} className={"inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 " + styles[variant]}>{children}</button>;
}

function Field({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return <label className="grid gap-2 text-sm"><span className="text-neutral-400">{label}</span><input {...props} className="h-10 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-blue-600" />{error ? <span className="text-xs text-red-300">{error}</span> : null}</label>;
}

function Brand() { return <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-sm font-bold">M</div><div><p className="font-semibold">MektA Studio</p><p className="text-xs text-neutral-500">Production workspace</p></div></div>; }

function SetupRequired() {
  return <main className="grid min-h-screen place-items-center bg-[#09090b] px-6 text-neutral-100"><section className="w-full max-w-lg rounded-lg border border-neutral-800 bg-[#111113] p-8"><Brand /><h1 className="mt-8 text-2xl font-semibold tracking-tight">Connect your database</h1><p className="mt-3 text-sm leading-6 text-neutral-400">This build has no local demo mode. Add the public Supabase variables to <code>.env.local</code>, run the SQL schema, and restart the app.</p><pre className="mt-6 overflow-auto rounded-lg border border-neutral-800 bg-black p-4 text-xs leading-6 text-neutral-300">{"NEXT_PUBLIC_SUPABASE_URL=...\\nNEXT_PUBLIC_SUPABASE_ANON_KEY=..."}</pre><p className="mt-5 text-xs text-neutral-500">Schema: <code>supabase/schema.sql</code></p></section></main>;
}

function AuthScreen({ client }: { client: Client }) {
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const form = useForm<{ email: string; password: string }>({ resolver: zodResolver(authSchema), defaultValues: { email: "", password: "" } });
  const submit = form.handleSubmit(async (values) => { setBusy(true); const result = signup ? await client.auth.signUp(values) : await client.auth.signInWithPassword(values); setBusy(false); if (result.error) toast.error(result.error.message); else if (signup) toast.success("Account created. Check your email to confirm access."); });
  return <main className="grid min-h-screen place-items-center bg-[#09090b] px-6 text-neutral-100"><Toaster theme="dark" position="bottom-right" /><section className="w-full max-w-md rounded-lg border border-neutral-800 bg-[#111113] p-8"><Brand /><h1 className="mt-8 text-2xl font-semibold tracking-tight">{signup ? "Create your account" : "Welcome back"}</h1><p className="mt-2 text-sm text-neutral-500">{signup ? "Your workspace is isolated by Supabase RLS." : "Sign in to access your projects."}</p><form onSubmit={submit} className="mt-7 grid gap-4"><Field label="Email" type="email" autoComplete="email" placeholder="you@company.com" {...form.register("email")} error={form.formState.errors.email?.message} /><Field label="Password" type="password" autoComplete={signup ? "new-password" : "current-password"} placeholder="At least 8 characters" {...form.register("password")} error={form.formState.errors.password?.message} /><Button type="submit" variant="primary" disabled={busy}>{busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}{busy ? "Working..." : signup ? "Create account" : "Sign in"}</Button></form><button className="mt-6 w-full text-center text-sm text-neutral-500 hover:text-neutral-200" onClick={() => setSignup(!signup)}>{signup ? "Already have an account? Sign in" : "Need an account? Create one"}</button></section></main>;
}

function Loading() { return <div className="grid gap-4 md:grid-cols-3"><div className="h-28 animate-pulse rounded-lg border border-neutral-800 bg-neutral-900/40" /><div className="h-28 animate-pulse rounded-lg border border-neutral-800 bg-neutral-900/40" /><div className="h-28 animate-pulse rounded-lg border border-neutral-800 bg-neutral-900/40" /><div className="h-56 animate-pulse rounded-lg border border-neutral-800 bg-neutral-900/40 md:col-span-3" /></div>; }
function Empty({ icon: Icon, title, description }: { icon: typeof FolderKanban; title: string; description: string }) { return <div className="grid place-items-center px-6 py-16 text-center"><Icon className="h-6 w-6 text-neutral-600" /><p className="mt-4 text-sm font-medium">{title}</p><p className="mt-2 max-w-sm text-sm leading-6 text-neutral-600">{description}</p></div>; }
function Metric({ label, value }: { label: string; value: string }) { return <section className="rounded-lg border border-neutral-800 bg-[#111113] p-5"><p className="text-sm text-neutral-500">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p></section>; }
function ProjectRow({ project }: { project: Project }) { return <div className="flex min-w-0 items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-neutral-800 bg-neutral-950"><Code2 className="h-4 w-4 text-neutral-500" /></div><div className="min-w-0"><p className="truncate text-sm font-medium">{project.name}</p><p className="truncate text-xs text-neutral-600">{project.description || "No description"}</p></div><span className="ml-2 hidden rounded-md border border-neutral-800 px-2 py-1 text-[11px] capitalize text-neutral-500 sm:inline">{project.status}</span></div>; }
function Overview({ projects, onOpen }: { projects: Project[]; onOpen: () => void }) { const live = projects.filter((p) => p.status === "live").length; return <div className="grid gap-5"><div className="grid gap-4 md:grid-cols-3"><Metric label="Total projects" value={projects.length.toString()} /><Metric label="Live projects" value={live.toString()} /><Metric label="Last activity" value={projects[0] ? new Date(projects[0].updated_at).toLocaleDateString() : "—"} /></div><section className="rounded-lg border border-neutral-800 bg-[#111113]"><div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4"><div><h2 className="font-medium">Recent projects</h2><p className="mt-1 text-sm text-neutral-500">Your latest database records.</p></div><button onClick={onOpen} className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white">View all <ChevronRight className="h-4 w-4" /></button></div>{projects.length === 0 ? <Empty icon={FolderKanban} title="No projects yet" description="Create your first project to start building your workspace." /> : <div className="divide-y divide-neutral-900">{projects.slice(0, 5).map((p) => <div key={p.id} className="px-5 py-4"><ProjectRow project={p} /></div>)}</div>}</section></div>; }
function Projects({ projects, onEdit, onDelete }: { projects: Project[]; onEdit: (p: Project) => void; onDelete: (p: Project) => void }) { return <section className="rounded-lg border border-neutral-800 bg-[#111113]"><div className="border-b border-neutral-800 px-5 py-4"><h2 className="font-medium">All projects</h2><p className="mt-1 text-sm text-neutral-500">Create, update, archive or delete your own records.</p></div>{projects.length === 0 ? <Empty icon={FolderKanban} title="No projects yet" description="Use New project to create a real record in Supabase." /> : <div className="divide-y divide-neutral-900">{projects.map((p) => <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-4"><ProjectRow project={p} /><div className="flex shrink-0 gap-1"><Button variant="ghost" onClick={() => onEdit(p)}>Edit</Button><Button variant="danger" onClick={() => onDelete(p)}><Trash2 className="h-4 w-4" /></Button></div></div>)}</div>}</section>; }
function Plugins({ plugins }: { plugins: PluginInstallation[] }) { return <section className="rounded-lg border border-neutral-800 bg-[#111113]"><div className="border-b border-neutral-800 px-5 py-4"><h2 className="font-medium">Installed plugins</h2><p className="mt-1 text-sm text-neutral-500">Plugin installations are scoped to your account.</p></div>{plugins.length === 0 ? <Empty icon={Package} title="No plugins installed" description="The plugin registry is not faked. Installations appear here after a real integration writes them to Supabase." /> : <div className="divide-y divide-neutral-900">{plugins.map((p) => <div key={p.id} className="flex items-center justify-between px-5 py-4"><div><p className="text-sm font-medium">{p.plugin_key}</p><p className="mt-1 text-xs text-neutral-600">Version {p.version}</p></div><Check className="h-4 w-4 text-blue-500" /></div>)}</div>}</section>; }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-30 grid place-items-center bg-black/70 p-4"><section className="w-full max-w-md rounded-lg border border-neutral-800 bg-[#111113] p-5"><div className="mb-6 flex items-center justify-between"><h2 className="font-medium">{title}</h2><button onClick={onClose} className="rounded-md p-1 text-neutral-500 hover:bg-neutral-900 hover:text-white"><X className="h-4 w-4" /></button></div>{children}</section></div>; }
function ProjectModal({ project, onClose, onSave }: { project: Project | null; onClose: () => void; onSave: (v: ProjectFormValues) => Promise<void> }) { const form = useForm<ProjectFormValues>({ resolver: zodResolver(projectSchema), defaultValues: { name: project?.name ?? "", description: project?.description ?? "", status: project?.status ?? "draft" } }); return <Modal title={project ? "Edit project" : "New project"} onClose={onClose}><form onSubmit={form.handleSubmit(onSave)} className="grid gap-4"><Field label="Name" placeholder="Project name" {...form.register("name")} error={form.formState.errors.name?.message} /><label className="grid gap-2 text-sm"><span className="text-neutral-400">Description</span><textarea rows={4} placeholder="What is this project for?" {...form.register("description")} className="resize-none rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-neutral-100 outline-none focus:border-blue-600" /></label><label className="grid gap-2 text-sm"><span className="text-neutral-400">Status</span><select {...form.register("status")} className="h-10 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm outline-none focus:border-blue-600"><option value="draft">Draft</option><option value="live">Live</option><option value="archived">Archived</option></select></label><div className="mt-2 flex justify-end gap-2"><Button onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Save project</Button></div></form></Modal>; }
function ProfileFields({ profile, email, onSave }: { profile: Profile | null; email: string; onSave: (v: { display_name: string; workspace_name: string }) => Promise<void> }) { const form = useForm<{ display_name: string; workspace_name: string }>({ resolver: zodResolver(profileSchema), defaultValues: { display_name: profile?.display_name ?? "", workspace_name: profile?.workspace_name ?? "Personal workspace" } }); return <form onSubmit={form.handleSubmit(onSave)} className="mt-6 grid gap-4"><Field label="Display name" placeholder="Your name" {...form.register("display_name")} error={form.formState.errors.display_name?.message} /><Field label="Workspace name" placeholder="Personal workspace" {...form.register("workspace_name")} error={form.formState.errors.workspace_name?.message} />{email ? <p className="text-xs text-neutral-600">Signed in as {email}</p> : null}<div className="flex justify-end"><Button type="submit" variant="primary">Save profile</Button></div></form>; }

function GuidedSetup({ profile, onSaveProfile, onCreateProject }: { profile: Profile | null; onSaveProfile: (v: { display_name: string; workspace_name: string }) => Promise<void>; onCreateProject: (v: ProjectFormValues) => Promise<void> }) {
  const [step, setStep] = useState(profile?.display_name ? 2 : 1);
  const [runtime, setRuntime] = useState<{ installed: boolean; version: string } | null>(null);
  const profileForm = useForm<{ display_name: string; workspace_name: string }>({ resolver: zodResolver(profileSchema), defaultValues: { display_name: profile?.display_name ?? "", workspace_name: profile?.workspace_name ?? "Personal workspace" } });
  const projectForm = useForm<ProjectFormValues>({ resolver: zodResolver(projectSchema), defaultValues: { name: "", description: "", status: "draft" } });
  const saveProfile = profileForm.handleSubmit(async (values) => { await onSaveProfile(values); setStep(2); });
  const createProject = projectForm.handleSubmit(async (values) => { await onCreateProject(values); setStep(3); });
  useEffect(() => { if (step === 3 && window.mekta) void window.mekta.runtimeStatus().then(setRuntime); }, [step]);
  return <main className="min-h-screen bg-[#09090b] px-5 py-10 text-neutral-100 md:px-10"><div className="mx-auto max-w-3xl"><Brand /><div className="mt-14 grid gap-10 md:grid-cols-[180px_1fr]"><div><p className="text-xs uppercase tracking-[0.18em] text-neutral-600">First launch</p><p className="mt-3 text-sm leading-6 text-neutral-500">I’ll guide you through the three things needed to make this workspace useful.</p><div className="mt-8 grid gap-3">{[1, 2, 3].map((item) => <div key={item} className={"flex items-center gap-3 text-sm " + (step >= item ? "text-neutral-100" : "text-neutral-700")}><span className={"grid h-7 w-7 place-items-center rounded-full border text-xs " + (step >= item ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-800")}>{step > item ? <Check className="h-4 w-4" /> : item}</span>{item === 1 ? "Your identity" : item === 2 ? "First project" : "Connect tools"}</div>)}</div></div><section className="rounded-lg border border-neutral-800 bg-[#111113] p-6 md:p-8">{step === 1 ? <><p className="text-sm text-blue-400">Step 1 of 3</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Let’s set up your workspace.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">Tell MektA who you are and what this workspace should be called. You can change this later in Settings.</p><form onSubmit={saveProfile} className="mt-8 grid max-w-md gap-4"><Field label="Your name" placeholder="How should we call you?" {...profileForm.register("display_name")} error={profileForm.formState.errors.display_name?.message} /><Field label="Workspace name" placeholder="What are you building?" {...profileForm.register("workspace_name")} error={profileForm.formState.errors.workspace_name?.message} /><div className="mt-3 flex justify-end"><Button type="submit" variant="primary">Continue <ChevronRight className="h-4 w-4" /></Button></div></form></> : step === 2 ? <><p className="text-sm text-blue-400">Step 2 of 3</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Create your first project.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">A project is the place where your files, commands and integrations live. Start with a clear name; you can edit everything later.</p><form onSubmit={createProject} className="mt-8 grid max-w-md gap-4"><Field label="Project name" placeholder="e.g. Client workspace" {...projectForm.register("name")} error={projectForm.formState.errors.name?.message} /><label className="grid gap-2 text-sm"><span className="text-neutral-400">What is it for?</span><textarea rows={4} placeholder="A short description helps you stay oriented." {...projectForm.register("description")} className="resize-none rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-neutral-100 outline-none focus:border-blue-600" /></label><div className="mt-3 flex justify-between gap-2"><Button onClick={() => setStep(3)}>Skip for now</Button><Button type="submit" variant="primary">Create project <ChevronRight className="h-4 w-4" /></Button></div></form></> : <><p className="text-sm text-blue-400">Step 3 of 3</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Connect your tools.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">MektA can run OpenCode commands from the desktop app. We check the real local bridge now; nothing is marked connected without proof.</p><div className="mt-8 flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-4"><Terminal className="h-5 w-5 text-neutral-500" /><div className="min-w-0"><p className="text-sm font-medium">{runtime?.installed ? "OpenCode is ready" : "OpenCode is not connected yet"}</p><p className="mt-1 text-xs text-neutral-600">{runtime?.installed ? runtime.version || "Installed locally" : window.mekta ? "You can connect it later from Agents & MCP." : "Install the desktop build to use the local command bridge."}</p></div><span className={"ml-auto h-2 w-2 rounded-full " + (runtime?.installed ? "bg-blue-600" : "bg-neutral-700")} /></div><div className="mt-8 flex justify-end"><Button variant="primary" onClick={() => window.location.reload()}>Enter workspace <ChevronRight className="h-4 w-4" /></Button></div></>}</section></div></div></main>;
}

function Agents() { return <AgentOrchestrator />; }
function Settings({ profile, email, onSave }: { profile: Profile | null; email: string; onSave: (v: { display_name: string; workspace_name: string }) => Promise<void> }) { return <section className="max-w-2xl rounded-lg border border-neutral-800 bg-[#111113] p-5"><div className="flex items-center gap-3"><UserRound className="h-5 w-5 text-neutral-500" /><div><h2 className="font-medium">Profile & workspace</h2><p className="mt-1 text-sm text-neutral-500">Update the identity shown inside your workspace.</p></div></div><ProfileFields profile={profile} email={email} onSave={onSave} /></section>; }

function Shell({ userId, email, source, onSignOut }: { userId: string; email: string; source: WorkspaceSource; onSignOut?: () => Promise<void> }) {
  const [view, setView] = useState<View>("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [plugins, setPlugins] = useState<PluginInstallation[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"project" | "profile" | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snapshot = await source.load();
      setProjects(snapshot.projects);
      setPlugins(snapshot.plugins);
      setProfile(snapshot.profile);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load workspace data");
    }
    setLoading(false);
  }, [source]);
  useEffect(() => { void load(); }, [load]);
  const saveProject = async (values: ProjectFormValues) => {
    const result = editing
      ? await source.updateProject(editing.id, values)
      : await source.createProject(values, userId);
    if (result) { toast.success(editing ? "Project updated" : "Project created"); setModal(null); setEditing(null); await load(); }
    else toast.error("Could not save project");
  };
  const deleteProject = async (project: Project) => {
    if (!window.confirm("Delete “" + project.name + "”? This cannot be undone.")) return;
    try { await source.deleteProject(project.id); toast.success("Project deleted"); await load(); } catch (caught) { toast.error(caught instanceof Error ? caught.message : "Could not delete project"); }
  };
  const saveProfile = async (values: { display_name: string; workspace_name: string }) => {
    try { const saved = await source.saveProfile(values, userId); setProfile(saved); setModal(null); toast.success("Profile saved"); } catch (caught) { toast.error(caught instanceof Error ? caught.message : "Could not save profile"); }
  };
  const nav = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "projects" as const, label: "Projects", icon: FolderKanban },
    { id: "plugins" as const, label: "Plugins", icon: Package },
    { id: "agents" as const, label: "Agents & MCP", icon: PlugZap },
    { id: "settings" as const, label: "Settings", icon: Settings2 }
  ];
  const title = view[0].toUpperCase() + view.slice(1);
  if (!loading && !error && (!profile || !profile.display_name)) {
    return <GuidedSetup profile={profile} onSaveProfile={saveProfile} onCreateProject={saveProject} />;
  }
  return <div className="min-h-screen bg-[#09090b] text-neutral-100">
    <Toaster theme="dark" position="bottom-right" />
    <header className="flex h-14 items-center justify-between border-b border-neutral-800 px-4 md:px-6">
      <div className="flex items-center gap-3"><button className="rounded-md p-2 text-neutral-500 hover:bg-neutral-900 md:hidden" onClick={() => setMobileNav(!mobileNav)}><Menu className="h-5 w-5" /></button><div className="grid h-7 w-7 place-items-center rounded-md bg-blue-600 text-xs font-bold">M</div><span className="text-sm font-semibold">MektA Studio</span><span className="hidden items-center gap-1.5 text-xs text-neutral-600 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />Ready</span></div>
      <div className="flex items-center gap-2"><span className="hidden text-xs text-neutral-600 md:block">{email}</span>{onSignOut ? <Button variant="ghost" onClick={() => void onSignOut()}><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></Button> : <span className="text-xs text-neutral-600">Local mode</span>}</div>
    </header>
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className={(mobileNav ? "fixed inset-y-14 left-0 z-20 flex " : "hidden ") + "w-64 shrink-0 flex-col border-r border-neutral-800 bg-[#09090b] p-3 md:flex"}>
        <nav className="grid gap-1">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setView(id); setMobileNav(false); }} className={"flex h-10 items-center gap-3 rounded-lg px-3 text-left text-sm transition " + (view === id ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-900/60 hover:text-neutral-200")}><Icon className="h-4 w-4" />{label}</button>)}</nav>
        <div className="mt-auto border-t border-neutral-900 pt-4"><button onClick={() => setModal("profile")} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-neutral-900"><div className="grid h-8 w-8 place-items-center rounded-full border border-neutral-800 bg-neutral-950 text-xs text-neutral-400">{(profile?.display_name || email || "M").slice(0, 1).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm text-neutral-200">{profile?.display_name || "Your profile"}</p><p className="truncate text-xs text-neutral-600">{profile?.workspace_name || "Personal workspace"}</p></div></button></div>
      </aside>
      <main className="min-w-0 flex-1"><div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs uppercase tracking-[0.18em] text-neutral-600">Workspace</p><h1 className="text-3xl font-semibold tracking-tight">{title}</h1></div>{(view === "overview" || view === "projects") && <Button variant="primary" onClick={() => { setEditing(null); setModal("project"); }}><Plus className="h-4 w-4" />New project</Button>}</div>
        {error ? <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-900/60 bg-red-950/20 p-4 text-sm text-red-200"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-medium">Could not load workspace data</p><p className="mt-1 text-red-300/70">{error}</p></div><button className="ml-auto" onClick={() => void load()}><RefreshCw className="h-4 w-4" /></button></div> : null}
        {loading ? <Loading /> : view === "overview" ? <Overview projects={projects} onOpen={() => setView("projects")} /> : view === "projects" ? <Projects projects={projects} onEdit={(project) => { setEditing(project); setModal("project"); }} onDelete={deleteProject} /> : view === "plugins" ? <Plugins plugins={plugins} /> : view === "agents" ? <Agents /> : <Settings profile={profile} email={email} onSave={saveProfile} />}
      </div></main>
    </div>
    {modal === "project" ? <ProjectModal project={editing} onClose={() => { setModal(null); setEditing(null); }} onSave={saveProject} /> : null}
    {modal === "profile" ? <Modal title="Profile" onClose={() => setModal(null)}><ProfileFields profile={profile} email="" onSave={saveProfile} /></Modal> : null}
  </div>;
}

export function ProductionApp() {
  const [client] = useState(getClient);
  const [localSource] = useState(createLocalWorkspaceSource);
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    if (!client) { setChecking(false); return; }
    let mounted = true;
    void client.auth.getSession().then(({ data }) => { if (mounted) { setSession(data.session); setChecking(false); } });
    const { data } = client.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, [client]);
  if (!client) return <Shell userId="local-user" email="Local workspace" source={localSource} />;
  if (checking) return <main className="grid min-h-screen place-items-center bg-[#09090b] text-neutral-500"><RefreshCw className="h-5 w-5 animate-spin" /></main>;
  return session ? <Shell userId={session.user.id} email={session.user.email ?? ""} source={createCloudWorkspaceSource(client, session.user.id)} onSignOut={() => client.auth.signOut().then(() => undefined)} /> : <AuthScreen client={client} />;
}

