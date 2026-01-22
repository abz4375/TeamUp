
import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional(), // Often email is handled separately or read-only
    // avatarUrl: z.string().url().optional(), // Future
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
