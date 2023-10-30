"use client"

import Loading from '@/app/(pages)/loading'
import NotFound from '@/app/not-found'
import { Icons } from '@/components/icons'
import ReplyThreadCard from '@/components/threads/reply-thread-card'
import ThreadCard from '@/components/threads/thread-card'
import { api } from '@/trpc/react'
import { SingleThreadCardProps } from '@/types'
import { MoreHorizontal, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface pageProps {

}

const page: React.FC<pageProps> = ({ }) => {
    const path = usePathname()
    const router = useRouter()
    if (!path.startsWith('/@')) {
        const newPath = '/@' + path.replace(/^\//, '')
        router.push(newPath);
        return null;
    }

    const segments = path.split('/');
    const id = segments[segments.length - 1] as string

    const { data, isLoading, isError } = api.post.getsThreadInfo.useQuery({ id })


    // console.dir(data, { depth: Infinity });

    if (isLoading) return <Loading />
    if (isError) return <NotFound />
    if (!data) {
        return <p>not found post</p>
    }

    return (
        <>
            <ReplyThreadCard {...data} />
            {data.replies?.map((post) => {
                return (
                    <ThreadCard
                        key={post.id}
                        id={post.id}
                        text={post.text}
                        createdAt={post.createdAt}
                        likeCount={post._count.likes}
                        replyCount={post._count.replies}
                        user={{
                            id: post.author.id,
                            username: post.author.username,
                            image: post.author.image,
                        }}
                        parentThreadId="skdll"
                        likes={post.likes}
                    />
                );
            })}
        </>
    )
}

export default page


// createdAt: Date;
// likeCount: number;
// replyCount: number;
// user: {
//     id: string;
//     username: string;
//     image: string;
// };
// parentThreadId: string | null;
// likedByMe: boolean;


// author: {
//     id: string;
//     _count: {
//         followers: number;
//     };
//     username: string;
//     image: string;
//     bio: string | null;
// };
// _count: {
//     likes: number;
//     replies: number;
// };