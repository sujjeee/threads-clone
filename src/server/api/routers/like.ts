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

            const data = { postId: id, userId };

            const existingLike = await ctx.db.like.findUnique({
                where: {
                    postId_userId: data
                },
            });

            if (existingLike == null) {

                const transactionResult = await ctx.db.$transaction(async (prisma) => {

                    const createdLike = await prisma.like.create({
                        data,
                        select: {
                            post: {
                                select: {
                                    text: true,
                                    author: true
                                }
                            }
                        }
                    });

                    const createdNotification = await prisma.notification.create({
                        data: {
                            type: 'LIKE',
                            senderUserId: userId,
                            receiverUserId: createdLike.post.author.id,
                            postId: data.postId,
                            message: createdLike.post.text
                        }
                    });

                    return {
                        createdLike,
                        createdNotification
                    };

                });

                if (!transactionResult) {
                    throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
                }

                return { addedLike: true };

            } else {
                const transactionResult = await ctx.db.$transaction(async (prisma) => {
                    const removeLike = await prisma.like.delete({
                        where: {
                            postId_userId: data
                        }
                    });

                    const notification = await prisma.notification.findFirst({
                        where: {
                            senderUserId: userId,
                            postId: data.postId,
                            type: 'LIKE',
                        },
                        select: {
                            id: true
                        }
                    });

                    if (notification) {
                        await prisma.notification.delete({
                            where: {
                                id: notification.id
                            }
                        });
                    }

                    return {
                        removeLike
                    };
                });

                if (!transactionResult) {
                    throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
                }

                return { addedLike: false };
            }
        }),

    postLikeInfo: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ input, ctx }) => {

            const userProfileInfo = await ctx.db.post.findUnique({
                where: {
                    id: input.id
                },
                select: {
                    likes: {
                        select: {
                            user: {
                                select: {
                                    ...GET_USER
                                }
                            }
                        }
                    },
                    reposts: {
                        select: {
                            userId: true
                        }
                    },
                }
            });

            if (!userProfileInfo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return userProfileInfo
        }),
});
