import {
  createTRPCRouter,
  publicProcedure
} from "@/server/api/trpc";

import { Prisma, Thread } from "@prisma/client";

export const threadsRouter = createTRPCRouter({

  info: publicProcedure
    .query(async ({ ctx }) => {

      const id = 'clolbll660005tbwgvyoixmmu'

      const parentThreads = await ctx.db.$queryRaw<Thread[]>(
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
                        'createdAt', to_timestamp(to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS'), 'YYYY-MM-DD"T"HH24:MI:SS'),
                        'followers', (
                          SELECT jsonb_agg(
                            jsonb_build_object(
                              'id', f.id,
                              'image', f.image
                            )
                          )
                          FROM "User" f
                          JOIN "_followers" uf ON f.id = uf."A"
                          WHERE uf."B" = u.id
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
                        'createdAt', to_timestamp(to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS'), 'YYYY-MM-DD"T"HH24:MI:SS'),
                        'followers', (
                          SELECT jsonb_agg(
                            jsonb_build_object(
                              'id', f.id,
                              'image', f.image
                            )
                          )
                          FROM "User" f
                          JOIN "_followers" uf ON f.id = uf."A"
                          WHERE uf."B" = u.id
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

      const filteredParentThreads = parentThreads.filter(parent => parent.id !== id);

      const mappedParentThreads = filteredParentThreads.map((parent: any, index) => {
        return {
          id: parent.id,
          createdAt: parent.createdAt,
          text: parent.text,
          parentThreadId: parent.parentThreadId,
          author: parent.author,
          count: {
            likeCount: parent.like_count,
            replyCount: parent.parent,
          },
          likes: {
            userId: parent.likes,
          },
          replies: parent.replies,
        };
      });

      return mappedParentThreads;

    }),
});
