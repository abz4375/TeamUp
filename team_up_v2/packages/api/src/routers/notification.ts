import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const notificationRouter = createTRPCRouter({
    list: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.notification.findMany({
                where: { userId: ctx.session.user.id },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });
        }),

    unreadCount: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.notification.count({
                where: {
                    userId: ctx.session.user.id,
                    read: false
                },
            });
        }),

    markAsRead: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const notification = await ctx.db.notification.findUnique({
                where: { id: input.id },
                select: { userId: true }
            });

            if (!notification || notification.userId !== ctx.session.user.id) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return ctx.db.notification.update({
                where: { id: input.id },
                data: { read: true }
            });
        }),

    markAllAsRead: protectedProcedure
        .mutation(async ({ ctx }) => {
            return ctx.db.notification.updateMany({
                where: {
                    userId: ctx.session.user.id,
                    read: false
                },
                data: { read: true }
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const notification = await ctx.db.notification.findUnique({
                where: { id: input.id },
                select: { userId: true }
            });

            if (!notification || notification.userId !== ctx.session.user.id) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return ctx.db.notification.delete({
                where: { id: input.id }
            });
        }),
});
