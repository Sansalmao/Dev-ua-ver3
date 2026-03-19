import { z } from "zod";

export const sectionItemSchema = z.object({
  title: z.string(),
  panelId: z.string(),
});

export const sectionSchema = z.object({
  title: z.string(),
  items: z.array(sectionItemSchema),
});

export const moduleFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(["Básico", "Intermedio", "Avanzado"]),
  duration: z.string(),
  objective: z.string(),
  progress: z.number().min(0).max(100).default(0),
  sections: z.array(sectionSchema),
  pubDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
});

export type ModuleFrontmatter = z.infer<typeof moduleFrontmatterSchema>;
export type ModuleSection = z.infer<typeof sectionSchema>;
export type ModuleSectionItem = z.infer<typeof sectionItemSchema>;
