import { z } from "zod";
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { GET_USER, GET_COUNT } from "@/server/constant";

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
                                    text: true
                                }
                            }
                        }
                    });

                    const createdNotification = await prisma.notification.create({
                        data: {
                            type: 'LIKE',
                            userId: data.userId,
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

                    const removeNotification = await prisma.notification.delete({
                        where: {
                            userId_postId_type: {
                                userId: data.userId,
                                postId: data.postId,
                                type: 'LIKE'
                            }
                        }
                    });

                    return {
                        removeLike,
                        removeNotification
                    };
                });

                if (!transactionResult) {
                    throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
                }

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
                    postId: input.id
                },
                select: {
                    post: {
                        select: {
                            ...GET_COUNT
                        }
                    },
                    user: {
                        select: {
                            ...GET_USER
                        }
                    }
                }
            });

            if (!userProfileInfo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return userProfileInfo
        }),
});
