import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@team-up/db";
import { minioClient } from "./lib/minio";

export const createTRPCContext = async (opts: { headers: Headers }) => {
    return {
        headers: opts.headers,
        db: prisma,
        minio: minioClient,
    };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    // In a real app, we verify the session here.
    const mockUser = { id: "user_123", name: "Demo User", email: "demo@example.com" };

    return next({
        ctx: {
            ...ctx,
            session: { user: mockUser },
        },
    });
});
