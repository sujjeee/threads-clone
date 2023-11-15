import {
    createTRPCRouter,
    privateProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const notificationRouter = createTRPCRouter({

    getNotification: privateProcedure
        .query(async ({ ctx }) => {
            const { userId } = ctx

            const getNotifications = await ctx.db.notification.findMany({
                where: {
                    OR: [
                        {
                            isPublic: true,
                            type: 'ADMIN',
                        },
                        {
                            isPublic: false,
                            type: 'ADMIN',
                            receiverUserId: userId
                        },
                        {
                            isPublic: false,
                            receiverUserId: userId,
                            senderUserId: {
                                not: userId
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    type: true,
                    createdAt: true,
                    read: true,
                    message: true,
                    senderUser: {
                        include: {
                            followers: true
                        }
                    },
                    post: true
                }
            });

            if (!getNotifications) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            // return notification
            return {
                notifications: getNotifications.map((notification) => ({
                    id: notification.id,
                    createdAt: notification.createdAt,
                    type: notification.type,
                    message: notification.message,
                    read: notification.read,
                    post: notification.post,
                    senderUser: notification.senderUser
                })),
            }
        }),
});
