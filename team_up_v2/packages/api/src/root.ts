import { createTRPCRouter, publicProcedure } from "./trpc";
import { userRouter } from "./routers/user";
import { projectRouter } from "./routers/project";
import { taskRouter } from "./routers/task";
import { notificationRouter } from "./routers/notification";

export const appRouter = createTRPCRouter({
    hello: publicProcedure.query(() => {
        return "Hello from tRPC!";
    }),
    user: userRouter,
    project: projectRouter,
    task: taskRouter,
    notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
