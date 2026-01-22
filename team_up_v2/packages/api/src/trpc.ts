import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@team-up/db";
import { minioClient } from "./lib/minio";

import { auth } from "./auth";

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
    const session = await auth.api.getSession({
        headers: ctx.headers,
    });

    if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
        ctx: {
            ...ctx,
            session,
        },
    });
});
