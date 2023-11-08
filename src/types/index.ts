import { AppRouter } from "@/server/api/root";
import { inferRouterOutputs } from "@trpc/server";

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type RouterOutput = inferRouterOutputs<AppRouter>;

export type ThreadCardProps = ArrayElement<RouterOutput['post']['getInfinitePost']['threads']>;
export type AuthorInfoProps = ThreadCardProps['author'];

// export type ThreadProps = RouterOutput['post']['getsThreadInfo'];
export type ThreadProps = RouterOutput['post']['getNestedThreads'];

// export type AuthorProps = Pick<SingleThreadCardProps['user'], '_count' | 'username' | 'image' | 'id'>;

export type ParentThreadCardProps = RouterOutput['post']['getPostInfo'];

export type UserCardProps = ArrayElement<RouterOutput['user']['allUsers']['allUsers']>;

export type UserProfileInfoProps = RouterOutput['user']['profileInfo']['userDetails'];

export type ParentThreadsProps = {
    id: string;
    createdAt: string;
    text: string;
    images: string[];
    likes: {
        userId: string;
    }[];
    parentThreadId: string | null;
    replies: {
        author: {
            username: string;
            id: string;
            image: string;
        };
    }[];
    author: {
        id: string;
        image: string;
        fullname: string;
        username: string;
        bio: string;
        link: string;
        createdAt: Date;
        isAdmin: boolean;
        followers: {
            id: string;
            image: string;
        }[];
    };
    like_count: number;
    reply_count: number;
}


export type TriggerVariant =
    | 'create'
    | 'reply'
    | 'quote'
    | 'home'

export interface TriggerProps {
    variant: TriggerVariant;
}