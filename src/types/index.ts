import { AppRouter } from "@/server/api/root";
import { inferRouterOutputs } from "@trpc/server";

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

type RouterOutput = inferRouterOutputs<AppRouter>;
export type ThreadCardProps = ArrayElement<RouterOutput['post']['infiniteFeed']['threads']>;
export type SingleThreadCardProps = ArrayElement<RouterOutput['post']['getsThreadInfo'][]>;
export type AuthorProps = Pick<SingleThreadCardProps['user'], '_count' | 'username' | 'image' | 'id'>;
// export type ParentThreadCardProps = Pick<SingleThreadCardProps, 'parentThread' >;
export type ParentThreadCardProps = ArrayElement<RouterOutput['post']['getsThreadInfo']['parentThread'][]>;
// export type ParentThreadCardProps = SingleThreadCardProps['parentThread'];


// type ParentThreadCardProps = {
//     parentThread: ({
//         author: {
//             id: string;
//             createdAt: Date;
//             updatedAt: Date;
//             username: string;
//             fullname: string;
//             image: string;
//             bio: string | null;
//             link: string | null;
//             email: string;
//             verified: boolean | null;
//             privacy: $Enums.Privacy;
//         };
//         likes: {
//             ...;
//         }[];
//         parentThread: {
//             ...;
//         } | null;
//         _count: {
//             ...;
//         };
//     } & {
//         ...;
//     }) | null;
// }