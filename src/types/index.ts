import { AppRouter } from "@/server/api/root";
import { inferRouterOutputs } from "@trpc/server";

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

type RouterOutput = inferRouterOutputs<AppRouter>;
export type ThreadCardProps = ArrayElement<RouterOutput['post']['infiniteFeed']['threads']>;
export type SingleThreadCardProps = ArrayElement<RouterOutput['post']['getsThreadInfo']>;
