import { z } from "zod";
export const authSchema = z.object({ email: z.string().email("Enter a valid email address"), password: z.string().min(8, "Password must be at least 8 characters") });
export const projectSchema = z.object({ name: z.string().trim().min(1, "Project name is required").max(120), description: z.string().trim().max(500).default(""), status: z.enum(["draft", "live", "archived"]).default("draft") });
export const profileSchema = z.object({ display_name: z.string().trim().max(80), workspace_name: z.string().trim().min(1).max(120) });
export type ProjectFormValues = z.infer<typeof projectSchema>;
