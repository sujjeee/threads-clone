import { AppRouter } from "@/server/api/root";
import { inferRouterOutputs } from "@trpc/server";

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type RouterOutput = inferRouterOutputs<AppRouter>;

export type ThreadCardProps = ArrayElement<RouterOutput['post']['infiniteFeed']['threads']>;
export type SingleThreadCardProps = ArrayElement<RouterOutput['post']['getsThreadInfo'][]>;
export type AuthorProps = Pick<SingleThreadCardProps['user'], '_count' | 'username' | 'image' | 'id'>;
export type ParentThreadCardProps = ArrayElement<RouterOutput['post']['getsThreadInfo']['parentThread'][]>;
export type UserCardProps = ArrayElement<RouterOutput['post']['getAllUsers']['allUsers']>;