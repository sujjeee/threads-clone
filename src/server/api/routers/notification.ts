import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure
} from "@/server/api/trpc";
import { GET_USER } from "@/server/constant";
import { TRPCError } from "@trpc/server";

export const notificationRouter = createTRPCRouter({

    getNotification: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ input, ctx }) => {
            const notification = await ctx.db.notification.findMany({
                where: {
                    OR: [
                        {
                            isPublic: true,
                            NOT: {
                                userId: input.id,
                            },
                        },
                        {
                            isPublic: false,
                            userId: input.id,
                        },
                    ],
                },
                select: {
                    user: {
                        select: {
                            ...GET_USER
                        }
                    },
                    createdAt: true,
                    message: true,
                    type: true,
                    postId: true
                }
            });

            if (!notification) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            return notification
        }),
});
