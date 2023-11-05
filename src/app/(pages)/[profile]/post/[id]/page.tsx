"use client"

import React from 'react'
import Loading from '@/app/(pages)/loading'
import NotFound from '@/app/not-found'
import ReplyThreadCard from '@/components/threads/reply-thread-card'
import ThreadCard from '@/components/threads/thread-card'
import { api } from '@/trpc/react'
import { usePathname, useRouter } from 'next/navigation'

interface pageProps { }

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

    const { data, isLoading, isError } = api.post.getNestedThreads.useQuery({ id })

    // console.dir(data, { depth: Infinity });

    if (isLoading) return <Loading />
    if (isError) return <NotFound />

    if (!data) {
        return <p>not found post</p>
    }

    return (
        <>
            <ReplyThreadCard {...data} />
            {/* {data.threadInfo.replies.map((post, index) => {
                return (
                    <ThreadCard
                        key={index}
                        {...post}
                    />
                );
            })} */}
        </>
    )
}

export default page
