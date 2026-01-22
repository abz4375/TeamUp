import { z } from "zod";

export const createProjectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().max(500).optional().nullable(),
});

export const updateProjectSchema = z.object({
    id: z.string(),
    title: z.string().min(3, "Title must be at least 3 characters").max(100).optional(),
    description: z.string().max(500).optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
