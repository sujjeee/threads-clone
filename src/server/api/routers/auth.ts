import { z } from "zod";
import { emailToUsername, getUserEmail } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { Privacy } from "@prisma/client";
import { generateUsername } from "@/app/_actions/generate-username";
import { clerkClient } from "@clerk/nextjs";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";

export const authRouter = createTRPCRouter({
  accountSetup: privateProcedure
    .input(
      z.object({
        bio: z.string(),
        link: z.string(),
        privacy: z.nativeEnum(Privacy).default("PUBLIC"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const email = getUserEmail(user);
      const username = (await generateUsername(user)) ?? emailToUsername(user);

      function getFullName(firstName: string, lastName: string) {
        if (
          !lastName ||
          lastName === undefined ||
          lastName === null ||
          lastName === ""
        ) {
          return firstName;
        }

        return `${firstName} ${lastName}`;
      }

      const fullname = getFullName(user?.firstName ?? "", user?.lastName ?? "");

      const dbUser = await ctx.db.user.findUnique({
        where: {
          email: email,
        },
      });

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
              verified: true,
            },
          });

          const params = { username: created_user.username };

          await clerkClient.users.updateUser(userId, params);

          await prisma.notification.create({
            data: {
              isPublic: false,
              type: "ADMIN",
              senderUserId: env.ADMIN_USER_ID,
              receiverUserId: created_user.id,
              message: `Hey ${created_user.fullname}! Welcome to Threads. I hope you like this project. If so, please make sure to give it a star on GitHub and share your views on Twitter. Thanks.`,
            },
          });
        });
      }

      return {
        username,
        success: true,
      };
    }),
});
