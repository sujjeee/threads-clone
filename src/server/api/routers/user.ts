import { z } from "zod";
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { GET_USER, GET_COUNT, GET_LIKES } from "@/server/constant";

export const userRouter = createTRPCRouter({

    profileInfo: publicProcedure
        .input(
            z.object({
                username: z.string()
            })
        )
        .query(async ({ input, ctx }) => {

            const isUser = await ctx.db.user.findUnique({
                where: {
                    username: input.username,
                    verified: true
                },
            });

            if (!isUser) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            const userProfileInfo = await ctx.db.user.findUnique({
                where: {
                    username: input.username
                },
                include: {
                    followers: true,
                    posts: {
                        select: {
                            id: true,
                            createdAt: true,
                            text: true,
                            images: true,
                            quoteId: true,
                            ...GET_LIKES,
                            parentPostId: true,
                            replies: {
                                select: {
                                    author: {
                                        select: {
                                            id: true,
                                            username: true,
                                            image: true,
                                        }
                                    }
                                }
                            },
                            author: {
                                select: {
                                    ...GET_USER,
                                }
                            },
                            ...GET_COUNT,
                            reposts: true
                        },
                    }
                }
            });

            if (!userProfileInfo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return {

                posts: userProfileInfo.posts.map((post) => ({
                    id: post.id,
                    createdAt: post.createdAt,
                    text: post.text,
                    images: post.images,
                    parentPostId: post.parentPostId,
                    author: post.author,
                    count: {
                        likeCount: post._count.likes,
                        replyCount: post._count.replies,
                    },
                    likes: post.likes,
                    replies: post.replies,
                    reposts: post.reposts,
                    quoteId: post.quoteId
                })),

                userDetails: {
                    id: userProfileInfo.id,
                    image: userProfileInfo.image,
                    fullname: userProfileInfo.fullname,
                    username: userProfileInfo.username,
                    bio: userProfileInfo.bio,
                    link: userProfileInfo.link,
                    privacy: userProfileInfo.privacy,
                    createdAt: userProfileInfo.createdAt,
                    isAdmin: userProfileInfo.isAdmin,
                    followers: userProfileInfo.followers
                }

            };

        }),

    allUsers: privateProcedure
        .input(
            z.object({
                limit: z.number().optional(),
                cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
            })
        )
        .query(async ({ input: { limit = 10, cursor }, ctx }) => {
            const allUsers = await ctx.db.user.findMany({
                take: limit + 1,
                cursor: cursor
                    ? { createdAt_id: cursor }
                    : undefined,
                orderBy: [
                    { createdAt: "desc" },
                    { id: "desc" }
                ],
                select: {
                    ...GET_USER
                }
            });

            let nextCursor: typeof cursor | undefined;

            if (allUsers.length > limit) {
                const nextItem = allUsers.pop();
                if (nextItem != null) {
                    nextCursor = {
                        id: nextItem.id,
                        createdAt: nextItem.createdAt
                    };
                }
            }
            return {
                allUsers,
                nextCursor,
            };
        }),

    toggleFollow: privateProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ input, ctx }) => {

            const { userId } = ctx;

            const isAlreadyFollowing = await ctx.db.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    username: true,
                    following: {
                        where: {
                            id: input.id
                        }
                    }
                }
            });

            console.log('isAlreadyFollowing', isAlreadyFollowing?.username, 'and', isAlreadyFollowing?.id)
            console.log('input id', input.id)

            if (isAlreadyFollowing?.following.length === 0) {

                const transactionResult = await ctx.db.$transaction(async (prisma) => {

                    const followUser = await prisma.user.update({
                        where: { id: userId },
                        data: {
                            following: {
                                connect: {
                                    id: input.id,
                                }
                            }
                        },
                        select: {
                            id: true,
                            username: true

                        }
                    });

                    console.log('followUser', followUser)

                    const createdNotification = await prisma.notification.create({
                        data: {
                            type: 'FOLLOW',
                            senderUserId: userId,
                            receiverUserId: input.id,
                            message: `"Followed you"`
                        },
                        select: {
                            id: true
                        }
                    });

                    return {
                        followUser,
                        createdNotification
                    };

                });

                if (!transactionResult) {
                    throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
                }

                return { followUser: true };

            } else {
                const transactionResult = await ctx.db.$transaction(async (prisma) => {

                    const unfollowUser = await prisma.user.update({
                        where: { id: userId },
                        data: {
                            following: {
                                disconnect: {
                                    id: input.id,
                                }
                            }
                        },
                    });

                    const notification = await prisma.notification.findFirst({
                        where: {
                            senderUserId: userId,
                            receiverUserId: input.id,
                            type: 'FOLLOW',
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
                        unfollowUser,
                    };

                });

                if (!transactionResult) {
                    throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
                }

                return { unFollowUser: false };
            }
        }),

});
