import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { emailToUsername, getUserEmail } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { Privacy } from "@prisma/client";
import { generateUsername } from "@/_actions/create";
import { clerkClient } from "@clerk/nextjs";

export const authRouter = createTRPCRouter({
    accountSetup: privateProcedure
        .input(
            z.object({
                bio: z.string(),
                link: z.string(),
                privacy:
                    z.enum(Object.values(Privacy) as [keyof typeof Privacy])
                        .default('PUBLIC')
            })
        )
        .mutation(async ({ ctx, input }) => {

            const { userId, user } = ctx

            if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

            const email = getUserEmail(user)
            const username = await generateUsername(user) ?? emailToUsername(user)
            const fullname = `${user?.firstName} ${user?.lastName}`

            const dbUser = await ctx.db.user.findUnique({
                where: {
                    email: email
                }
            })

            if (!dbUser) {
                await ctx.db.$transaction(async (prisma) => {
                    const created_user = await prisma.user.create({
                        data: {
                            id: user.id,
                            username,
                            fullname,
                            image: user.imageUrl,
                            privacy: input.privacy,
                            bio: input.bio,
                            link: input.link,
                            email,
                            verified: true
                        }
                    });

                    const params = { username: created_user.username };

                    const updateUsername = await clerkClient.users.updateUser(userId, params);
                    console.log("updateUsername", updateUsername)

                    // TODO: use in prod.
                    // await prisma.notification.create({
                    //     data: {
                    //         type: 'ADMIN',
                    //         isPublic: true,
                    //         userId: 'user_2TWK6vz4I7TtQ7JVmBAZlu',
                    //         threadId: '2TWK6vz4I7TtQ7JVmBAZlDZY7lu',
                    //         message: `Hey ${created_user.fullname}! Welcome to Threads. I hope you like this project. If so, please make sure to give it a star on GitHub and share your views on Twitter. Thanks.`
                    //     }
                    // });
                });
            }

            return {
                username,
                success: true
            }
        }),
});
