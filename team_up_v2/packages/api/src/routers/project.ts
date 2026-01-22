
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createProjectSchema, updateProjectSchema } from "@team-up/validation";
import { TRPCError } from "@trpc/server";
import { ProjectRole } from "@team-up/db";

export const projectRouter = createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.project.findMany({
            where: {
                members: {
                    some: {
                        userId: ctx.session.user.id
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        tasks: true,
                        members: true,
                    }
                },
                owner: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
    }),

    byId: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const project = await ctx.db.project.findUnique({
                where: { id: input.id },
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        }
                    },
                    members: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            tasks: true
                        }
                    }
                }
            });

            if (!project) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found'
                });
            }

            // Check if user is a member
            const isMember = project.members.some(m => m.userId === ctx.session.user.id);
            if (!isMember) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have access to this project'
                });
            }

            return project;
        }),

    create: protectedProcedure
        .input(createProjectSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.project.create({
                data: {
                    title: input.title,
                    description: input.description,
                    ownerId: ctx.session.user.id,
                    members: {
                        create: {
                            userId: ctx.session.user.id,
                            role: ProjectRole.OWNER,
                        }
                    }
                }
            });
        }),

    update: protectedProcedure
        .input(updateProjectSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            // Check ownership/permissions
            const project = await ctx.db.project.findUnique({
                where: { id },
                select: { ownerId: true }
            });

            if (!project) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            if (project.ownerId !== ctx.session.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: "Only the owner can update project settings"
                });
            }

            return ctx.db.project.update({
                where: { id },
                data
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const project = await ctx.db.project.findUnique({
                where: { id: input.id },
                select: { ownerId: true }
            });

            if (!project) throw new TRPCError({ code: 'NOT_FOUND' });

            if (project.ownerId !== ctx.session.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: "Only the owner can delete the project"
                });
            }

            return ctx.db.project.delete({
                where: { id: input.id }
            });
        }),

    getMembers: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const project = await ctx.db.project.findUnique({
                where: { id: input.id },
                include: {
                    members: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                }
                            }
                        }
                    }
                }
            });

            if (!project) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found'
                });
            }

            // Check if user is a member
            const isMember = project.members.some(m => m.userId === ctx.session.user.id);
            if (!isMember) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have access to this project'
                });
            }

            return project.members.map(m => m.user);
        }),
});
