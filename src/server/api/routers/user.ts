import { z } from "zod";
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { GET_USER } from "@/server/constant";
import { GET_COUNT } from "@/server/constant";

export const userRouter = createTRPCRouter({

    profileInfo: publicProcedure
        .input(
            z.object({
                username: z.string()
            })
        )
        .query(async ({ input, ctx }) => {

            const userProfileInfo = await ctx.db.user.findUnique({
                where: {
                    username: input.username
                },
                include: {
                    followers: true,
                    threads: {
                        select: {
                            id: true,
                            createdAt: true,
                            text: true,
                            likes: {
                                select: {
                                    userId: true
                                }
                            },
                            parentThreadId: true,
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
                        },
                    }
                }
            });

            if (!userProfileInfo) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return {

                threads: userProfileInfo.threads.map((thread) => ({
                    id: thread.id,
                    createdAt: thread.createdAt,
                    text: thread.text,
                    parentThreadId: thread.parentThreadId,
                    author: thread.author,
                    count: {
                        likeCount: thread._count.likes,
                        replyCount: thread._count.replies,
                    },
                    likes: thread.likes,
                    replies: thread.replies,
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
