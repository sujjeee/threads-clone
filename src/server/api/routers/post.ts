import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure
} from "@/server/api/trpc";
import { getUserEmail } from "@/lib/utils";
import { PostPrivacy, Prisma } from "@prisma/client";
import Filter from 'bad-words';
import {
  GET_USER,
  GET_COUNT,
  GET_REPOSTS,
  GET_REPLIES,
  GET_LIKES
} from "@/server/constant";
import type { ParentPostsProps } from "@/types";

export const postRouter = createTRPCRouter({

  createPost: privateProcedure
    .input(
      z.object({
        text: z.string().min(3, {
          message: "Text must be at least 3 character",
        }),
        imageUrl: z.string().optional(),
        privacy: z.nativeEnum(PostPrivacy).default('ANYONE'),
        quoteId: z.string().optional(),
        postAuthor: z.string().optional()
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

      const transactionResult = await ctx.db.$transaction(async (prisma) => {

        const newpost = await ctx.db.post.create({
          data: {
            text: filteredText,
            authorId: userId,
            images: input.imageUrl ? [input.imageUrl] : [],
            privacy: input.privacy,
            quoteId: input.quoteId
          },
          select: {
            id: true,
            author: true
          }
        })

        if (input.postAuthor && userId !== input.postAuthor) {
          await prisma.notification.create({
            data: {
              type: 'QUOTE',
              senderUserId: userId,
              receiverUserId: input.postAuthor,
              postId: newpost.id,
              message: input.text
            }
          });
        }

        return {
          newpost,
        };

      });

      if (!transactionResult) {
        throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
      }

      return {
        createPost: transactionResult.newpost,
        success: true
      }

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
      const allPosts = await ctx.db.post.findMany({
        where: {
          text: {
            contains: searchQuery
          },
          parentPostId: null
        },
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          createdAt: true,
          text: true,
          images: true,
          parentPostId: true,
          quoteId: true,
          author: {
            select: {
              ...GET_USER,
            }
          },
          ...GET_LIKES,
          ...GET_REPLIES,
          ...GET_COUNT,
          ...GET_REPOSTS
        },
      });

      let nextCursor: typeof cursor | undefined;

      if (allPosts.length > limit) {
        const nextItem = allPosts.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        posts: allPosts.map((post) => ({
          id: post.id,
          createdAt: post.createdAt,
          text: post.text,
          parentPostId: post.parentPostId,
          author: post.author,
          count: {
            likeCount: post._count.likes,
            replyCount: post._count.replies,
          },
          likes: post.likes,
          replies: post.replies,
          quoteId: post.quoteId,
          images: post.images,
          reposts: post.reposts
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

      const postInfo = await ctx.db.post.findUnique({
        where: {
          id: input.id
        },
        select: {
          id: true,
          text: true,
          createdAt: true,
          images: true,
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
          parentPost: {
            include: {
              likes: true,
              ...GET_COUNT,
              author: true,
              parentPost: true
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
              ...GET_COUNT,
              ...GET_LIKES,
            }
          },
          ...GET_COUNT,
        }
      });


      if (!postInfo) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return {
        postInfo: {
          id: postInfo.id,
          text: postInfo.text,
          createdAt: postInfo.createdAt,
          likeCount: postInfo._count.likes,
          replyCount: postInfo._count.replies,
          user: postInfo.author,
          parentPost: postInfo.parentPost,
          likes: postInfo.likes,
          replies: postInfo.replies
        }
      }
    }),

  replyToPost: privateProcedure
    .input(
      z.object({
        postAuthor: z.string(),
        postId: z.string(),
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

      const transactionResult = await ctx.db.$transaction(async (prisma) => {

        const repliedPost = await prisma.post.create({
          data: {
            text: filteredText,
            images: input.imageUrl ? [input.imageUrl] : [],
            privacy: input.privacy,
            author: {
              connect: {
                id: userId,
              },
            },
            parentPost: {
              connect: {
                id: input.postId
              }
            },
          },
          select: {
            id: true,
            author: true
          }
        })

        if (userId !== input.postAuthor) {
          await prisma.notification.create({
            data: {
              type: 'REPLY',
              senderUserId: userId,
              receiverUserId: input.postAuthor,
              postId: input.postId,
              message: input.text
            }
          });
        }

        return {
          repliedPost,
        };

      });

      if (!transactionResult) {
        throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
      }

      return {
        createPost: transactionResult.repliedPost,
        success: true
      }

    }),

  getNestedPosts: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input
      const getPosts = await ctx.db.post.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          text: true,
          createdAt: true,
          ...GET_COUNT,
          images: true,
          parentPostId: true,
          author: {
            select: {
              ...GET_USER
            }
          },
          ...GET_LIKES,
          replies: {
            select: {
              id: true,
              createdAt: true,
              text: true,
              images: true,
              quoteId: true,
              ...GET_REPOSTS,
              ...GET_LIKES,
              parentPostId: true,
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
          },
          quoteId: true,
          ...GET_REPOSTS
        },
      });

      const parentPosts = await ctx.db.$queryRaw<ParentPostsProps[]>(
        Prisma.sql`
          WITH RECURSIVE Posts_tree AS (
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
              (SELECT json_agg(
                json_build_object('userId', "userId")
              )
              FROM "Like" 
              WHERE "postId" = t.id
            ) AS likes,
              (SELECT jsonb_agg(
                jsonb_build_object(
                  'author', jsonb_build_object(
                    'id', r."authorId",
                    'username', ru.username,
                    'image', ru.image
                  )
                )
              )
              FROM "Post" r
              JOIN "User" ru ON r."authorId" = ru.id
              WHERE r."parentPostId" = t.id) AS replies,
              (SELECT count(*) FROM "Like" l WHERE l."postId" = t.id) AS like_count,
              (SELECT count(*) FROM "Post" r WHERE r."parentPostId" = t.id) AS reply_count,
              (SELECT "quoteId" FROM "Post" WHERE "id" = t.id) AS quote_id,
              (SELECT jsonb_agg(jsonb_build_object('userId', "userId", 'postId', "postId")) 
                FROM "Repost" 
                WHERE "postId" = t.id) AS reposts
            FROM "Post" t
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
              (SELECT json_agg(
                json_build_object('userId', "userId")
              )
              FROM "Like" 
              WHERE "postId" = t.id
            ) AS likes,
              (SELECT jsonb_agg(
                jsonb_build_object(
                  'author', jsonb_build_object(
                    'id', r."authorId",
                    'username', ru.username,
                    'image', ru.image
                  )
                )
              )
              FROM "Post" r
              JOIN "User" ru ON r."authorId" = ru.id
              WHERE r."parentPostId" = t.id) AS replies,
              (SELECT count(*) FROM "Like" l WHERE l."postId" = t.id) AS like_count,
              (SELECT count(*) FROM "Post" r WHERE r."parentPostId" = t.id) AS reply_count,
              (SELECT "quoteId" FROM "Post" WHERE "id" = t.id) AS quote_id,
              (SELECT jsonb_agg(jsonb_build_object('userId', "userId", 'postId', "postId")) 
                FROM "Repost" 
                WHERE "postId" = t.id) AS reposts
            FROM "Post" t
            JOIN "User" u ON t."authorId" = u.id
            JOIN Posts_tree tt ON t.id = tt."parentPostId"
          )
      
          SELECT *
          FROM Posts_tree
          ORDER BY depth;
        `
      );

      if (!getPosts) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return {
        postInfo: {
          id: getPosts.id,
          createdAt: getPosts.createdAt,
          text: getPosts.text,
          images: getPosts.images,
          quoteId: getPosts.quoteId,
          reposts: getPosts.reposts,
          parentPostId: getPosts.parentPostId,
          author: getPosts.author,
          count: {
            likeCount: getPosts._count.likes,
            replyCount: getPosts._count.replies,
          },
          likes: getPosts.likes,
          replies: getPosts.replies.map(({ _count, ...reply }) => ({
            ...reply,
            count: {
              likeCount: _count.likes,
              replyCount: _count.replies,
            },
          })),
        },

        // TODO: need to fix type here
        parentPosts: parentPosts
          .filter(parent => parent.id !== id)
          .map((parent) => {
            return {
              id: parent.id,
              createdAt: new Date(parent.createdAt),
              text: parent.text,
              images: parent.images,
              parentPostId: parent.parentPostId,
              author: parent.author,
              count: {
                likeCount: Number(parent.like_count),
                replyCount: Number(parent.reply_count),
              },
              likes: parent.likes ?? [],
              replies: parent.replies ?? [],
              quoteId: parent.quoteId,
              reposts: parent.reposts,
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

      const data = { postId: id, userId };

      const existingRepost = await ctx.db.repost.findUnique({
        where: {
          postId_userId: data
        },
      });

      if (existingRepost == null) {

        const transactionResult = await ctx.db.$transaction(async (prisma) => {

          const createdRepost = await prisma.repost.create({
            data,
            select: {
              post: {
                select: {
                  text: true,
                  authorId: true
                }
              }
            }
          });

          const createNotification = await prisma.notification.create({
            data: {
              type: 'REPOST',
              postId: data.postId,
              message: createdRepost.post.text,
              senderUserId: userId,
              receiverUserId: createdRepost.post.authorId
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
        const transactionResult = await ctx.db.$transaction(async (prisma) => {

          const removeRepost = await prisma.repost.delete({
            where: {
              postId_userId: data
            }
          });

          const notification = await prisma.notification.findFirst({
            where: {
              senderUserId: userId,
              postId: data.postId,
              type: 'REPOST',
            },
            select: {
              id: true
            }
          });

          if (notification) {
            await prisma.notification.delete({
              where: {
                id: notification.id
              }
            });
          }

          return {
            removeRepost,
          }

        });

        if (!transactionResult) {
          throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
        }

        return { createdRepost: false };

      }
    }),

  getQuotedPost: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {

      const postInfo = await ctx.db.post.findUnique({
        where: {
          id: input.id
        },
        select: {
          id: true,
          createdAt: true,
          text: true,
          ...GET_LIKES,
          images: true,
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
        }
      });


      if (!postInfo) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return {
        postInfo: {
          id: postInfo.id,
          text: postInfo.text,
          createdAt: postInfo.createdAt,
          likeCount: postInfo._count.likes,
          replyCount: postInfo._count.replies,
          user: postInfo.author,
          likes: postInfo.likes,
          replies: postInfo.replies
        }
      }
    }),

  deletePost: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx
      const transactionResult = await ctx.db.$transaction(async (prisma) => {
        const PostInfo = await prisma.post.delete({
          where: {
            id: input.id,
            authorId: userId
          },
          select: {
            id: true
          }
        });

        if (!PostInfo) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        }

        await prisma.post.updateMany({
          where: {
            quoteId: input.id,
          },
          data: {
            quoteId: null,
          }
        })

        return { success: true }
      })

      if (!transactionResult) {
        throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
      }

      return { success: true }
    }),
});



// await ctx.prisma.post.updateMany({
//   where: {
//     quoteId: input.id,
//   },
//   data: {
//     quoteId: null, // Update the quoteId to null or an empty string as needed
// });

// return { success: true }



