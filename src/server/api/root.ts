import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "@/server/api/routers/auth";
import { likeRouter } from "@/server/api/routers/like";
import { userRouter } from "@/server/api/routers/user";
import { notificationRouter } from "@/server/api/routers/notification";
import { searchRouter } from "@/server/api/routers/search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  post: postRouter,
  like: likeRouter,
  search: searchRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
