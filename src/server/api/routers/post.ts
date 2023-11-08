import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure
} from "@/server/api/trpc";
import { getUserEmail } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { GET_USER } from "@/server/constant";
import { GET_COUNT } from "@/server/constant";
import { PostPrivacy, Prisma } from "@prisma/client";
import { ParentThreadsProps } from "@/types";
import Filter from 'bad-words';

export const postRouter = createTRPCRouter({

  createPost: privateProcedure
    .input(
      z.object({
        text: z.string().min(3, {
          message: "Text must be at least 3 character",
        }),
        imageUrl: z.string().optional(),
        privacy: z.nativeEnum(PostPrivacy)
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

      if (!dbUser) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const filter = new Filter()
      const filteredText = filter.clean(input.text)

      const newpost = await ctx.db.thread.create({
        data: {
          text: filteredText,
          authorId: userId,
          images: input.imageUrl ? [input.imageUrl] : [],
          privacy: input.privacy
        }
      })

      return { newpost, success: true }

    }),

  getInfinitePost: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor, searchQuery }, ctx }) => {
      const allThreads = await ctx.db.thread.findMany({
        where: {
          text: {
            contains: searchQuery
          },
          parentThreadId: null
        },
        take: limit + 1,

        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          createdAt: true,
          text: true,
          likes: {
            select: {
              userId: true
            }
          },
          images: true,
          parentThreadId: true,
          replies: {
            select: {
              author: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                }
              }
            }
          },
          author: {
            select: {
              ...GET_USER,
            }
          },
          reposts: true,
          ...GET_COUNT,
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
        threads: allThreads.map((thread) => ({
          id: thread.id,
          createdAt: thread.createdAt,
          text: thread.text,
          parentThreadId: thread.parentThreadId,
          author: thread.author,
          count: {
            likeCount: thread._count.likes,
            replyCount: thread._count.replies,
          },
          likes: thread.likes,
          replies: thread.replies,
          images: thread.images,
          reposts: thread.reposts
        })),
        nextCursor,
      };
    }),

  getPostInfo: publicProcedure
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
        threadInfo: {
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
      }
    }),

  replyToPost: privateProcedure
    .input(
      z.object({
        threadId: z.string(),
        text: z.string().min(3, {
          message: "Text must be at least 3 character",
        }),
        imageUrl: z.string().optional(),
        privacy: z.nativeEnum(PostPrivacy)
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
          images: input.imageUrl ? [input.imageUrl] : [],
          privacy: input.privacy,
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

  getNestedThreads: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input
      const getThreads = await ctx.db.thread.findUnique({
        where: {
          id
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
          images: true,
          parentThreadId: true,
          author: {
            select: {
              ...GET_USER
            }
          },
          likes: {
            select: {
              userId: true
            }
          },
          replies: {
            select: {
              id: true,
              createdAt: true,
              text: true,
              images: true,
              likes: {
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
                      image: true,
                    }
                  }
                }
              },
              author: {
                select: {
                  ...GET_USER,
                }
              },
              ...GET_COUNT,
            },
          }
        },
      });

      const parentThreads = await ctx.db.$queryRaw<ParentThreadsProps[]>(
        Prisma.sql`
          WITH RECURSIVE threads_tree AS (
            SELECT
              t.*,
              0 AS depth,
              jsonb_build_object(
                'id', u.id,
                'username', u.username,
                'image', u.image,
                'fullname', u.fullname,
                'bio', u.bio,
                'link', u.link,
                'createdAt', u.created_at,
                'followers', COALESCE(
                  (
                    SELECT jsonb_agg( 
                      jsonb_build_object('id', f.id, 'image', f.image)
                    ) 
                    FROM "User" f 
                    JOIN "_followers" uf ON f.id = uf."A" 
                    WHERE uf."B" = u.id
                  ),
                  '[]'
                )
              ) AS author,
              (SELECT json_agg("userId")  
              FROM "Like" 
              WHERE "threadId" = t.id) AS likes,
              (SELECT jsonb_agg(
                jsonb_build_object(
                  'author', jsonb_build_object(
                    'id', r."authorId",
                    'username', ru.username,
                    'image', ru.image
                  )
                )
              )
              FROM "Thread" r
              JOIN "User" ru ON r."authorId" = ru.id
              WHERE r."parentThreadId" = t.id) AS replies,
              (SELECT count(*) FROM "Like" l WHERE l."threadId" = t.id) AS like_count,
              (SELECT count(*) FROM "Thread" r WHERE r."parentThreadId" = t.id) AS reply_count  
            FROM "Thread" t
            JOIN "User" u ON t."authorId" = u.id
            WHERE t.id = ${id}
      
            UNION ALL
      
            SELECT
              t.*,
              tt.depth + 1,
              jsonb_build_object(
                'id', u.id,
                'username', u.username,
                'image', u.image,
                'fullname', u.fullname,
                'bio', u.bio,
                'link', u.link,
                'createdAt', u.created_at,
                'followers', COALESCE(
                  (
                    SELECT jsonb_agg( 
                      jsonb_build_object('id', f.id, 'image', f.image)
                    ) 
                    FROM "User" f 
                    JOIN "_followers" uf ON f.id = uf."A" 
                    WHERE uf."B" = u.id
                  ),
                  '[]'
                )
              ) AS author,
              (SELECT json_agg("userId")  
              FROM "Like" 
              WHERE "threadId" = t.id) AS likes,
              (SELECT jsonb_agg(
                jsonb_build_object(
                  'author', jsonb_build_object(
                    'id', r."authorId",
                    'username', ru.username,
                    'image', ru.image
                  )
                )
              )
              FROM "Thread" r
              JOIN "User" ru ON r."authorId" = ru.id
              WHERE r."parentThreadId" = t.id) AS replies,
              (SELECT count(*) FROM "Like" l WHERE l."threadId" = t.id) AS like_count,
              (SELECT count(*) FROM "Thread" r WHERE r."parentThreadId" = t.id) AS reply_count
            FROM "Thread" t
            JOIN "User" u ON t."authorId" = u.id
            JOIN threads_tree tt ON t.id = tt."parentThreadId"
          )
      
          SELECT *
          FROM threads_tree
          ORDER BY depth;
        `
      );

      if (!getThreads) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return {
        threadInfo: {
          id: getThreads.id,
          createdAt: getThreads.createdAt,
          text: getThreads.text,
          images: getThreads.images,
          parentThreadId: getThreads.parentThreadId,
          author: getThreads.author,
          count: {
            likeCount: getThreads._count.likes,
            replyCount: getThreads._count.replies,
          },
          likes: getThreads.likes,
          replies: getThreads.replies.map(({ _count, ...reply }) => ({
            ...reply,
            count: {
              likeCount: _count.likes,
              replyCount: _count.replies,
            },
          })),
        },

        // TODO: need to fix type here
        parentThreads: parentThreads
          .filter(parent => parent.id !== id)
          .map((parent) => {
            return {
              id: parent.id,
              createdAt: new Date(parent.createdAt),
              text: parent.text,
              images: parent.images,
              parentThreadId: parent.parentThreadId,
              author: parent.author,
              count: {
                likeCount: Number(parent.like_count),
                replyCount: Number(parent.reply_count),
              },
              likes: parent.likes ?? [],
              replies: parent.replies ?? [],
            };
          }).reverse()
      }
    }),

  toggleRepost: privateProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({ input: { id }, ctx }) => {

      const { userId } = ctx;

      const data = { threadId: id, userId };

      const existingRepost = await ctx.db.repost.findUnique({
        where: {
          threadId_userId: data
        },
      });

      if (existingRepost == null) {

        const transactionResult = await ctx.db.$transaction(async (prisma) => {

          const createdRepost = await prisma.repost.create({
            data,
            select: {
              thread: {
                select: {
                  text: true
                }
              }
            }
          });

          const createNotification = await prisma.notification.create({
            data: {
              type: 'REPOST',
              userId: data.userId,
              threadId: data.threadId,
              message: createdRepost.thread.text
            }
          });

          return {
            createdRepost,
            createNotification
          };

        });

        if (!transactionResult) {
          throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
        }

        return { createdRepost: true };

      } else {
        await ctx.db.$transaction(async (prisma) => {

          await prisma.repost.delete({
            where: {
              threadId_userId: data
            }
          });

          await prisma.notification.delete({
            where: {
              userId_threadId_type: {
                userId: data.userId,
                threadId: data.threadId,
                type: 'REPOST'
              }
            }
          });

        });

        return { createdRepost: false };

      }
    }),

  createQuotePost: privateProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string().min(3, {
          message: "Text must be at least 3 character",
        }),
        imageUrl: z.string().optional()
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

      if (!dbUser) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const filter = new Filter()
      const filteredText = filter.clean(input.text)

      const newpost = await ctx.db.thread.create({
        data: {
          quoteId: input.id,
          text: filteredText,
          authorId: userId,
          images: input.imageUrl ? [input.imageUrl] : [],
        }
      })

      return { newpost, success: true }

    }),

});



