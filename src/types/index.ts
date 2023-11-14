import type { AppRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type RouterOutput = inferRouterOutputs<AppRouter>;

export type PostCardProps = ArrayElement<RouterOutput['post']['getInfinitePost']['posts']>;

export type AuthorInfoProps = PostCardProps['author'];

export type PostReplyCardProps = RouterOutput['post']['getNestedPosts'];

export type UserCardProps = ArrayElement<RouterOutput['user']['allUsers']['allUsers']>;

export type UserProfileInfoProps = RouterOutput['user']['Info']['userDetails'];

export type ParentPostInfo = Pick<PostCardProps, 'id' | 'text' | 'images' | 'author'>;

export type ParentPostsProps = {
    id: string;
    createdAt: string;
    text: string;
    images: string[];
    likes: {
        userId: string;
    }[];
    quoteId: string | null;
    reposts: {
        userId: string;
        postId: string;
    }[];
    parentPostId: string | null;
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

export interface ThreadInfo {
    id: string;
    text: string;
    image: string | undefined;
    author: AuthorInfoProps;
}
