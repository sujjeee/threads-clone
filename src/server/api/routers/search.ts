import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure
} from "@/server/api/trpc";
import { GET_USER } from "@/server/constant";

export const searchRouter = createTRPCRouter({

    allUsers: publicProcedure
        .input(
            z.object({
                debouncedSearch: z.string()
            })
        )
        .query(async ({ input, ctx }) => {
            const user = await ctx.db.user.findMany({
                where: {
                    OR: [
                        {
                            fullname: {
                                contains: input.debouncedSearch
                            }
                        },
                        {
                            username: {
                                contains: input.debouncedSearch
                            }
                        },
                        {
                            email: {
                                contains: input.debouncedSearch
                            }
                        },
                    ],
                },
                select: {
                    ...GET_USER
                }
            });
            return user
        }),

});
