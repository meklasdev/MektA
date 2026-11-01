export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type Database = {
  public: {
    Tables: {
      profiles: { Row: { id: string; display_name: string; workspace_name: string; avatar_url: string | null; created_at: string; updated_at: string }; Insert: { id: string; display_name?: string; workspace_name?: string; avatar_url?: string | null }; Update: { display_name?: string; workspace_name?: string; avatar_url?: string | null }; Relationships: [] };
      projects: { Row: { id: string; owner_id: string; name: string; description: string; status: "draft" | "live" | "archived"; workspace_path: string | null; created_at: string; updated_at: string }; Insert: { owner_id: string; name: string; description?: string; status?: "draft" | "live" | "archived"; workspace_path?: string | null }; Update: { name?: string; description?: string; status?: "draft" | "live" | "archived"; workspace_path?: string | null }; Relationships: [] };
      plugin_installations: { Row: { id: string; owner_id: string; plugin_key: string; version: string; config: Json; created_at: string; updated_at: string }; Insert: { owner_id: string; plugin_key: string; version: string; config?: Json }; Update: { version?: string; config?: Json }; Relationships: [] };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
