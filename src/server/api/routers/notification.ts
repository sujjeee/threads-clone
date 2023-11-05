import { z } from "zod";

import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure
} from "@/server/api/trpc";

import { GET_USER } from "@/server/constant";

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
                    threadId: true
                }
            });
            return notification
        }),

});
