import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure, publicProcedure } from "@/server/api/trpc";
import { getUserEmail } from "@/lib/utils";

export const postRouter = createTRPCRouter({
  createThread: privateProcedure
    .input(
      z.object({
        text: z.string().min(3, {
          message: "Text must be at least 3 character",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user, userId } = ctx;
      const email = getUserEmail(user)
      const dbUser = await ctx.db.user.findUnique({
        where: {
          email: email
        },
        select: {
          verified: true
        }
      })

      console.log("dbUser?", dbUser)
      if (!dbUser) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const newpost = await ctx.db.thread.create({
        data: {
          text: input.text,
          authorId: userId
        }
      })
      // console.log("new post", newpost)

      return { newpost, success: true }
    }),

  infiniteFeed: privateProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {

      const { userId } = ctx;

      const allThreads = await ctx.db.thread.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          text: true,
          createdAt: true,
          _count: {
            select: {
              likes: true
            }
          },
          author: {
            select: {
              id: true,
              username: true,
              image: true,
            }
          },
          likes: {
            where: {
              userId
            },
            select: {
              userId: true
            }
          }
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (allThreads.length > limit) {
        const nextItem = allThreads.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        threads: allThreads.map((thread) => {
          return {
            id: thread.id,
            text: thread.text,
            createdAt: thread.createdAt,
            likeCount: thread._count.likes,
            user: thread.author,
            likedByMe: thread.likes?.length > 0,
          };
        }),
        nextCursor,
      };
    }),

  toggleLike: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {

      const { userId } = ctx;

      const data = { threadId: id, userId };

      const existingLike = await ctx.db.like.findUnique({
        where: {
          threadId_userId: data
        },
      });

      if (existingLike == null) {
        await ctx.db.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.db.like.delete({
          where: {
            threadId_userId: data
          }
        });
        return { addedLike: false };
      }
    }),
});
