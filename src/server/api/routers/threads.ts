import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { currentUser } from "@clerk/nextjs";
import { getUserEmail } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

export const authRouter = createTRPCRouter({
    accountSetup: publicProcedure.query(async () => {
        const user = await currentUser();

        const email = getUserEmail(user)

        if (!user?.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

        const dbUser = await db.user.findFirst({
            where: {
                email: email
            }
        })

        if (!dbUser) {
            await db.user.create({
                data: {
                    id: user.id,
                    username: "hello",
                    fullname: "heloa",
                    image: user.imageUrl,
                    public: true,
                    bio: "hello",
                    email: email,
                    verified: false
                }
            })
        }
        return { success: true }
    }),
});
