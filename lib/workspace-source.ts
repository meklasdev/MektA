"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type PluginInstallation = Database["public"]["Tables"]["plugin_installations"]["Row"];
export type ProjectInput = Pick<Project, "name" | "description" | "status">;
export type ProfileInput = Pick<Profile, "display_name" | "workspace_name">;

export type WorkspaceSnapshot = {
  profile: Profile | null;
  projects: Project[];
  plugins: PluginInstallation[];
};

export type WorkspaceSource = {
  mode: "local" | "cloud";
  load: () => Promise<WorkspaceSnapshot>;
  saveProfile: (input: ProfileInput, userId: string) => Promise<Profile>;
  createProject: (input: ProjectInput, userId: string) => Promise<Project>;
  updateProject: (id: string, input: ProjectInput) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
};
type CloudClient = ReturnType<typeof createBrowserClient<Database>>;

const storageKey = "mekta.workspace.v1";
const now = () => new Date().toISOString();

function emptyWorkspace(): WorkspaceSnapshot {
  return { profile: null, projects: [], plugins: [] };
}

async function readLocal(): Promise<WorkspaceSnapshot> {
  const value = window.mekta ? await window.mekta.loadWorkspace() : JSON.parse(window.localStorage.getItem(storageKey) || "null") as unknown;
  if (!value || typeof value !== "object") return emptyWorkspace();
  const candidate = value as Partial<WorkspaceSnapshot>;
  return { profile: candidate.profile ?? null, projects: candidate.projects ?? [], plugins: candidate.plugins ?? [] };
}

async function writeLocal(snapshot: WorkspaceSnapshot) {
  if (window.mekta) await window.mekta.saveWorkspace(snapshot);
  else window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
}

export function createLocalWorkspaceSource(): WorkspaceSource {
  let cache: WorkspaceSnapshot | null = null;
  const load = async () => { cache = await readLocal(); return cache; };
  const current = async () => cache ?? load();
  return {
    mode: "local",
    load,
    saveProfile: async (input, userId) => {
      const snapshot = await current();
      const timestamp = now();
      const profile: Profile = { id: userId, display_name: input.display_name, workspace_name: input.workspace_name, avatar_url: null, created_at: snapshot.profile?.created_at ?? timestamp, updated_at: timestamp };
      cache = { ...snapshot, profile };
      await writeLocal(cache);
      return profile;
    },
    createProject: async (input, userId) => {
      const snapshot = await current();
      const timestamp = now();
      const project: Project = { id: crypto.randomUUID(), owner_id: userId, ...input, workspace_path: null, created_at: timestamp, updated_at: timestamp };
      cache = { ...snapshot, projects: [project, ...snapshot.projects] };
      await writeLocal(cache);
      return project;
    },
    updateProject: async (id, input) => {
      const snapshot = await current();
      const existing = snapshot.projects.find((project) => project.id === id);
      if (!existing) throw new Error("Project was not found locally.");
      const project = { ...existing, ...input, updated_at: now() };
      cache = { ...snapshot, projects: snapshot.projects.map((item) => item.id === id ? project : item) };
      await writeLocal(cache);
      return project;
    },
    deleteProject: async (id) => {
      const snapshot = await current();
      cache = { ...snapshot, projects: snapshot.projects.filter((project) => project.id !== id) };
      await writeLocal(cache);
    }
  };
}

export function createCloudWorkspaceSource(client: CloudClient, userId: string): WorkspaceSource {
  return {
    mode: "cloud",
    load: async () => {
      const [projects, plugins, profile] = await Promise.all([
        client.from("projects").select("*").order("updated_at", { ascending: false }),
        client.from("plugin_installations").select("*").order("updated_at", { ascending: false }),
        client.from("profiles").select("*").eq("id", userId).maybeSingle()
      ]);
      const failure = projects.error || plugins.error || profile.error;
      if (failure) throw new Error(failure.message);
      return { profile: profile.data, projects: projects.data ?? [], plugins: plugins.data ?? [] };
    },
    saveProfile: async (input) => {
      const result = await client.from("profiles").upsert({ id: userId, ...input } as never).select("*").single();
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    createProject: async (input) => {
      const result = await client.from("projects").insert({ ...input, owner_id: userId } as never).select("*").single();
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    updateProject: async (id, input) => {
      const result = await client.from("projects").update(input as never).eq("id", id).select("*").single();
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    deleteProject: async (id) => {
      const result = await client.from("projects").delete().eq("id", id);
      if (result.error) throw new Error(result.error.message);
    }
  };
}
