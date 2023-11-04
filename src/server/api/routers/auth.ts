import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { currentUser } from "@clerk/nextjs";
import { emailToUsername, getUserEmail } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { Privacy } from "@prisma/client";

export const authRouter = createTRPCRouter({
    accountSetup: publicProcedure
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
            const user = await currentUser();
            if (!user?.id)
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            const email = getUserEmail(user)
            const username = emailToUsername(user)
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

                    await prisma.notification.create({
                        data: {
                            type: 'ADMIN',
                            isPublic: true,
                            userId: 'user_clok01xeo0001tbookiyi1ipx',
                            threadId: 'clok01xeo0001tbookiyi1ipx',
                            message: `Hey ${created_user.fullname}! Welcome to Threads. I hope you like this project. If so, please make sure to give it a star on GitHub and share your views on Twitter. Thanks.`
                        }
                    });
                });
            }
            return { success: true }
        }),
});
