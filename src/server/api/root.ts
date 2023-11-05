import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "@/server/api/routers/auth";
import { likeRouter } from "./routers/like";
import { userRouter } from "./routers/user";
import { notificationRouter } from "./routers/notification";
import { searchRouter } from "./routers/search";
import { threadsRouter } from "./routers/threads";

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
  threads: threadsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
