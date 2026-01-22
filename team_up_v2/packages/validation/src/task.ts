import { z } from "zod";
export enum TaskStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    SUBMITTED = "SUBMITTED",
    COMPLETED = "COMPLETED",
}

export const taskStatusSchema = z.nativeEnum(TaskStatus);

export const createTaskSchema = z.object({
    projectId: z.string(),
    description: z.string().min(1, "Description is required").max(1000),
    status: taskStatusSchema.optional().default(TaskStatus.NOT_STARTED),
    assigneeIds: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
    id: z.string(),
    description: z.string().max(1000).optional(),
    status: taskStatusSchema.optional(),
    submitted: z.boolean().optional(),
    assigneeIds: z.array(z.string()).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
