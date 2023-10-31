import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure, publicProcedure } from "@/server/api/trpc";
import { getUserEmail } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";

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

      // console.log("dbUser?", dbUser)
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
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {

      const { userId } = ctx;

      const allThreads = await ctx.db.thread.findMany({
        where: {
          parentThreadId: null
        },
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          text: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
              replies: true
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
          },
          parentThreadId: true,
          replies: {
            select: {
              author: {
                select: {
                  id: true,
                  username: true,
                  image: true
                }
              }
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
            replyCount: thread._count.replies,
            user: thread.author,
            parentThreadId: thread.parentThreadId,
            likes: thread.likes,
            replies: thread.replies
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

  getsThreadInfo: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await currentUser()

      const threadInfo = await ctx.db.thread.findUnique({
        where: {
          id: input.id
        },
        select: {
          id: true,
          text: true,
          createdAt: true,
          images: true,
          _count: {
            select: {
              likes: true,
              replies: true
            }
          },
          author: {
            select: {
              id: true,
              username: true,
              image: true,
              bio: true,
              _count: {
                select: {
                  followers: true
                }
              },
            }
          },
          likes: {
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                  fullname: true,
                  image: true,
                  bio: true,
                  followers: true
                }
              }
            }
          },
          parentThread: {
            include: {
              likes: true,
              _count: {
                select: {
                  likes: true,
                  replies: true
                }
              },
              author: true,
              parentThread: true
            }
          },
          replies: {
            select: {
              id: true,
              text: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                  bio: true,
                  _count: {
                    select: {
                      followers: true
                    }
                  },
                }
              },
              _count: {
                select: {
                  likes: true,
                  replies: true
                }
              },
              likes: {
                where: {
                  userId: user?.id
                },
                select: {
                  userId: true
                }
              },
            }
          }
        }
      });


      if (!threadInfo) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return {
        id: threadInfo.id,
        text: threadInfo.text,
        createdAt: threadInfo.createdAt,
        likeCount: threadInfo._count.likes,
        replyCount: threadInfo._count.replies,
        user: threadInfo.author,
        parentThread: threadInfo.parentThread,
        likes: threadInfo.likes,
        replies: threadInfo.replies
      }
    }),

  replyToThread: privateProcedure
    .input(
      z.object({
        threadId: z.string(),
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

      const repliedThreadPost = await ctx.db.thread.create({
        data: {
          text: input.text,
          author: {
            connect: {
              id: userId,
            },
          },
          parentThread: {
            connect: {
              id: input.threadId
            }
          },

        },
      })
      return { repliedThreadPost, success: true }
    }),

  getAllUsers: privateProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const allUsers = await ctx.db.user.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          createdAt: true,
          username: true,
          fullname: true,
          image: true,
          bio: true,
          link: true,
        }
      });

      let nextCursor: typeof cursor | undefined;
      if (allUsers.length > limit) {
        const nextItem = allUsers.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        allUsers,
        nextCursor,
      };
    }),
  getUserThreads: privateProcedure
    .input(
      z.object({
        username: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;
      const userThreads = await ctx.db.thread.findMany({
        where: {
          author: {
            username: input.username
          }
        },
        select: {
          id: true,
          text: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
              replies: true
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
          },
          parentThreadId: true,
          replies: {
            select: {
              author: {
                select: {
                  id: true,
                  username: true,
                  image: true
                }
              }
            }
          }
        },
      });
      return {
        userThreads: userThreads.map((thread) => {
          return {
            id: thread.id,
            text: thread.text,
            createdAt: thread.createdAt,
            likeCount: thread._count.likes,
            replyCount: thread._count.replies,
            user: thread.author,
            likes: thread.likes,
            replies: thread.replies
          };
        }),
      };
    }),
  getUserProfileInfo: privateProcedure
    .input(
      z.object({
        username: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;
      const userProfileInfo = await ctx.db.user.findUnique({
        where: {
          username: input.username
        },
        // include: {
        // followers:true,
        // following:true,
        // threads: {
        //   select: {
        //     id: true,
        //     text: true,
        //     createdAt: true,
        //     _count: {
        //       select: {
        //         likes: true,
        //         replies: true
        //       }
        //     },
        //     author: {
        //       select: {
        //         id: true,
        //         username: true,
        //         image: true,
        //       }
        //     },
        //     likes: {
        //       where: {
        //         userId
        //       },
        //       select: {
        //         userId: true
        //       }
        //     },
        //     parentThreadId: true,
        //     replies: {
        //       select: {
        //         author: {
        //           select: {
        //             id: true,
        //             username: true,
        //             image: true
        //           }
        //         }
        //       }
        //     }
        //   },
        // },
        // }
      });
      if (userProfileInfo) {
        return userProfileInfo
      } else {

        throw new TRPCError({ code: 'NOT_FOUND' })

      }
    }),
});
