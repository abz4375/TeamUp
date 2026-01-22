
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createTaskSchema, updateTaskSchema } from "@team-up/validation";
import { TRPCError } from "@trpc/server";

export const taskRouter = createTRPCRouter({
    listByProject: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.task.findMany({
                where: { projectId: input.projectId },
                include: {
                    assignees: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                }
                            }
                        }
                    },
                    creator: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    _count: {
                        select: {
                            attachments: true,
                            approvals: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }),

    byId: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const task = await ctx.db.task.findUnique({
                where: { id: input.id },
                include: {
                    assignees: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                }
                            }
                        }
                    },
                    attachments: {
                        include: {
                            // uploadedBy: true // Already have ID, maybe add name if needed
                        },
                        orderBy: {
                            uploadedAt: 'desc'
                        }
                    },
                    creator: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    _count: {
                        select: {
                            approvals: true,
                        }
                    }
                }
            });

            if (!task) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Task not found'
                });
            }

            return task;
        }),

    create: protectedProcedure
        .input(createTaskSchema)
        .mutation(async ({ ctx, input }) => {
            const { assigneeIds, ...data } = input;

            const task = await ctx.db.task.create({
                data: {
                    ...data,
                    creatorId: ctx.session.user.id,
                    assignees: assigneeIds && assigneeIds.length > 0
                        ? {
                            create: assigneeIds.map(userId => ({ userId }))
                        }
                        : undefined
                }
            });

            // Create notifications for assignees
            if (assigneeIds && assigneeIds.length > 0) {
                await ctx.db.notification.createMany({
                    data: assigneeIds.map(userId => ({
                        userId,
                        title: "New Task Assigned",
                        message: `${ctx.session.user.name || 'Someone'} assigned you to: ${task.description.slice(0, 50)}...`,
                        type: "TASK_ASSIGNED",
                        link: `/projects/${task.projectId}`,
                    }))
                });

                // Emit notification events
                const { emitRealtimeEvent, RealtimeEvents } = await import("../lib/realtime");
                for (const userId of assigneeIds) {
                    await emitRealtimeEvent("notification", `user:${userId}`, { type: "unread_update" });
                }
            }

            // Emit task update event
            const { emitRealtimeEvent, RealtimeEvents } = await import("../lib/realtime");
            await emitRealtimeEvent(RealtimeEvents.TASK_UPDATED, `project:${task.projectId}`, {
                projectId: task.projectId,
                taskId: task.id,
                type: 'create'
            });

            return task;
        }),

    update: protectedProcedure
        .input(updateTaskSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, assigneeIds, ...data } = input;

            // Get existing task to compare status/assignees
            const existingTask = await ctx.db.task.findUnique({
                where: { id },
                include: { assignees: true }
            });

            if (!existingTask) throw new TRPCError({ code: 'NOT_FOUND' });

            if (assigneeIds) {
                const currentAssigneeIds = existingTask.assignees.map(a => a.userId);
                const newAssigneeIds = assigneeIds.filter(id => !currentAssigneeIds.includes(id));

                await ctx.db.taskAssignee.deleteMany({
                    where: { taskId: id }
                });

                if (assigneeIds.length > 0) {
                    await ctx.db.taskAssignee.createMany({
                        data: assigneeIds.map((userId: string) => ({
                            taskId: id,
                            userId
                        }))
                    });
                }

                // Notify new assignees
                if (newAssigneeIds.length > 0) {
                    await ctx.db.notification.createMany({
                        data: newAssigneeIds.map(userId => ({
                            userId,
                            title: "New Task Assigned",
                            message: `${ctx.session.user.name || 'Someone'} assigned you to a task.`,
                            type: "TASK_ASSIGNED",
                            link: `/projects/${existingTask.projectId}`,
                        }))
                    });

                    const { emitRealtimeEvent } = await import("../lib/realtime");
                    for (const userId of newAssigneeIds) {
                        await emitRealtimeEvent("notification", `user:${userId}`, { type: "unread_update" });
                    }
                }
            }

            const task = await ctx.db.task.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date(),
                    submittedAt: data.submitted ? new Date() : undefined
                }
            });

            // If status changed, notify all current assignees
            if (data.status && data.status !== existingTask.status) {
                const updatedTask = await ctx.db.task.findUnique({
                    where: { id },
                    include: { assignees: true }
                });

                if (updatedTask && updatedTask.assignees.length > 0) {
                    await ctx.db.notification.createMany({
                        data: updatedTask.assignees.map(a => ({
                            userId: a.userId,
                            title: "Task Status Updated",
                            message: `Task status changed to ${data.status.replace('_', ' ')}`,
                            type: "STATUS_CHANGE",
                            link: `/projects/${task.projectId}`,
                        }))
                    });

                    const { emitRealtimeEvent } = await import("../lib/realtime");
                    for (const a of updatedTask.assignees) {
                        await emitRealtimeEvent("notification", `user:${a.userId}`, { type: "unread_update" });
                    }
                }
            }

            // Emit task update event
            const { emitRealtimeEvent, RealtimeEvents } = await import("../lib/realtime");
            await emitRealtimeEvent(RealtimeEvents.TASK_UPDATED, `project:${task.projectId}`, {
                projectId: task.projectId,
                taskId: task.id,
                type: 'update'
            });

            return task;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Optional: Check permissions
            return ctx.db.task.delete({
                where: { id: input.id }
            });
        }),

    getUploadUrl: protectedProcedure
        .input(z.object({
            filename: z.string(),
            contentType: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const { getPresignedPostUrl, ensureBucket } = await import("../lib/minio");
            await ensureBucket();
            return getPresignedPostUrl(input.filename, input.contentType);
        }),

    addAttachment: protectedProcedure
        .input(z.object({
            taskId: z.string(),
            filename: z.string(),
            objectName: z.string(),
            fileSize: z.number(),
            mimeType: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { getFileUrl } = await import("../lib/minio");
            const fileUrl = getFileUrl(input.objectName);

            return ctx.db.taskAttachment.create({
                data: {
                    taskId: input.taskId,
                    filename: input.filename,
                    fileUrl,
                    fileSize: input.fileSize,
                    mimeType: input.mimeType,
                    uploadedById: ctx.session.user.id,
                }
            });
        }),
});
