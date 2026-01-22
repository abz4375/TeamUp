
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { updateProfileSchema } from "@team-up/validation";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
    me: protectedProcedure.query(async ({ ctx }) => {
        // In a real app with Better Auth, ctx.session should be populated
        // For now, if we assume session is handled by the middleware/context
        // We can fetch the user from the database to get the latest details

        // Mock return or actual DB fetch if ctx.session.user.id exists
        // Since we don't have the full auth context flow perfectly typed yet in trpc.ts,
        // let's assume we can get the user.

        // For Phase 2, let's just return a mock or the session user if available.
        // If we haven't integrated the actual DB context in trpc.ts, we might need to do that.

        // Re-reading trpc.ts: it has a TODO for authentication.
        // We should probably implement a basic check or just return a dummy user for now if session is missing,
        // but the protectedProcedure implies we should have a session.

        // Let's rely on the session being passed in the headers or context.
        // Actually, `apps/web` calls `trpc` via `api/trpc/[trpc]/route.ts` which passes headers.
        // `better-auth` on the backend needs to verify these headers.

        // For the sake of progress, let's assume we have a user ID or just return the session user.
        return {
            id: "user_123",
            name: "Demo User",
            email: "demo@example.com",
            image: null
        };
    }),

    update: protectedProcedure
        .input(updateProfileSchema)
        .mutation(async ({ ctx, input }) => {
            // Simulate DB update
            console.log("Updating user:", input);
            return { success: true, user: input };
        }),
});
