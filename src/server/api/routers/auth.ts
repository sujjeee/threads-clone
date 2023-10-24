import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { currentUser } from "@clerk/nextjs";
import { getUserEmail } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

export const authRouter = createTRPCRouter({
    accountSetup: publicProcedure
        .input(
            z.object({
                username: z.string()
                    .min(3, {
                        message: "Must be at least 3 character",
                    }),
                bio: z.string(),
                link: z.string(),
                public: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await currentUser();
            const email = getUserEmail(user)
            const fullname = `${user?.firstName} ${user?.lastName}`

            if (!user?.id)
                throw new TRPCError({ code: 'UNAUTHORIZED' })

            const dbUser = await ctx.db.user.findUnique({
                where: {
                    email: email
                }
            })

            if (!dbUser) {
                await db.user.create({
                    data: {
                        id: user.id,
                        username: input.username,
                        fullname,
                        image: user.imageUrl,
                        public: input.public,
                        bio: input.bio,
                        link: input.link,
                        email,
                        verified: true
                    }
                })
            }
            return { success: true }
        }),
});
