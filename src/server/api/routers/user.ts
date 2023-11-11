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

});
