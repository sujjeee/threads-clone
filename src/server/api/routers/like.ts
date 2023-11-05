import { z } from "zod";

import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { GET_USER } from "@/server/constant";

export const likeRouter = createTRPCRouter({

    toggleLike: privateProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ input: { id }, ctx }) => {

            const { userId } = ctx;

            const data = { threadId: id, userId };

            const existingLike = await ctx.db.like.findUnique({
                where: {
                    threadId_userId: data
                },
            });

            if (existingLike == null) {

                const transactionResult = await ctx.db.$transaction(async (prisma) => {

                    const createdLike = await prisma.like.create({
                        data,
                        select: {
                            thread: {
                                select: {
                                    text: true
                                }
                            }
                        }
                    });

                    const createNotification = await prisma.notification.create({
                        data: {
                            type: 'LIKE',
                            userId: data.userId,
                            threadId: data.threadId,
                            message: createdLike.thread.text
                        }
                    });

                    return {
                        createdLike,
                        createNotification
                    };

                });
                if (!transactionResult) {
                    throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
                }

                return { addedLike: true };

            } else {
                await ctx.db.$transaction(async (prisma) => {

                    await prisma.like.delete({
                        where: {
                            threadId_userId: data
                        }
                    });

                    await prisma.notification.delete({
                        where: {
                            userId_threadId_type: {
                                userId: data.userId,
                                threadId: data.threadId,
                                type: 'LIKE'
                            }
                        }
                    });
                });

                return { addedLike: false };

            }
        }),

    likeInfo: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ input, ctx }) => {

            const userProfileInfo = await ctx.db.like.findMany({
                where: {
                    threadId: input.id
                },
                select: {
                    thread: {
                        select: {
                            _count: {
                                select: {
                                    likes: true,
                                    replies: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            ...GET_USER
                        }
                    }
                }
            });
            if (userProfileInfo) {
                return userProfileInfo
            } else {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }
        }),


});
