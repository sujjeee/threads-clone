import { z } from "zod";
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { GET_USER, GET_COUNT, GET_LIKES, GET_REPLIES, GET_REPOSTS } from "@/server/constant";

export const userRouter = createTRPCRouter({

    Info: publicProcedure
        .input(
            z.object({
                username: z.string()
            })
        )
        .query(async ({ input, ctx }) => {

            const isUser = await ctx.db.user.findUnique({
                where: {
                    username: input.username,
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
                }
            });

            if (!userProfileInfo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return {
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

    postInfo: publicProcedure
        .input(
            z.object({
                username: z.string()
            })
        )
        .query(async ({ input, ctx }) => {

            const isUser = await ctx.db.user.findUnique({
                where: {
                    username: input.username,
                },
            });

            if (!isUser) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            const userProfileInfo = await ctx.db.post.findMany({
                where: {
                    author: {
                        username: input.username
                    },
                    parentPostId: null
                },
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    createdAt: true,
                    text: true,
                    images: true,
                    parentPostId: true,
                    quoteId: true,
                    author: {
                        select: {
                            ...GET_USER,
                        }
                    },
                    ...GET_LIKES,
                    ...GET_REPLIES,
                    ...GET_COUNT,
                    ...GET_REPOSTS
                },
            });

            if (!userProfileInfo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            const posts = userProfileInfo.map((post) => ({
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
            }))

            return posts
        }),

    repliesInfo: publicProcedure
        .input(
            z.object({
                username: z.string()
            })
        )
        .query(async ({ input, ctx }) => {

            const isUser = await ctx.db.user.findUnique({
                where: {
                    username: input.username,
                },
            });

            if (!isUser) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            const userProfileInfo = await ctx.db.post.findMany({
                where: {
                    author: {
                        username: input.username
                    },
                    parentPostId: {
                        not: null
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    createdAt: true,
                    text: true,
                    images: true,
                    parentPostId: true,
                    quoteId: true,
                    author: {
                        select: {
                            ...GET_USER,
                        }
                    },
                    ...GET_LIKES,
                    ...GET_REPLIES,
                    ...GET_COUNT,
                    ...GET_REPOSTS
                },
            });

            if (!userProfileInfo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            const replies = userProfileInfo.map((post) => ({
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
            }))

            return replies

        }),

    repostsInfo: publicProcedure
        .input(
            z.object({
                username: z.string()
            })
        )
        .query(async ({ input, ctx }) => {

            const isUser = await ctx.db.user.findUnique({
                where: {
                    username: input.username,
                },
            });

            if (!isUser) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            const userProfileInfo = await ctx.db.repost.findMany({
                where: {
                    user: {
                        username: input.username
                    }
                },
                select: {
                    post: {
                        select: {
                            id: true,
                            createdAt: true,
                            text: true,
                            images: true,
                            parentPostId: true,
                            quoteId: true,
                            author: {
                                select: {
                                    ...GET_USER,
                                }
                            },
                            ...GET_LIKES,
                            ...GET_REPLIES,
                            ...GET_COUNT,
                            ...GET_REPOSTS
                        }
                    }
                },
            });

            if (!userProfileInfo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            const reposts = userProfileInfo.map((postObject) => ({
                id: postObject.post.id,
                createdAt: postObject.post.createdAt,
                text: postObject.post.text,
                images: postObject.post.images,
                parentPostId: postObject.post.parentPostId,
                author: postObject.post.author,
                count: {
                    likeCount: postObject.post._count.likes,
                    replyCount: postObject.post._count.replies,
                },
                likes: postObject.post.likes,
                replies: postObject.post.replies,
                reposts: postObject.post.reposts,
                quoteId: postObject.post.quoteId,
            }));

            return reposts

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
