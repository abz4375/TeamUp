
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

            return ctx.db.task.create({
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
        }),

    update: protectedProcedure
        .input(updateTaskSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, assigneeIds, ...data } = input;

            // Optional: Check if user has permission to update tasks in this project
            // (e.g. is member or owner of the project)

            if (assigneeIds) {
                // Update assignees: simple way is to clear and re-add
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
            }

            return ctx.db.task.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date(),
                    submittedAt: data.submitted ? new Date() : undefined
                }
            });
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
