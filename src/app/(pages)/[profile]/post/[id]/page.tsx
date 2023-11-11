"use client"

import React from 'react'
import Loading from '@/app/loading'
import NotFound from '@/app/not-found'
import ReplyThreadCard from '@/components/threads/reply-thread-card'
import ThreadCard from '@/components/threads/thread-card'
import { api } from '@/trpc/react'
import { usePathname, useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

interface PostInfoPage { }

const PostInfoPage: React.FC<PostInfoPage> = ({ }) => {
    const path = usePathname()
    const router = useRouter()

    if (path.length < 20 && !path.startsWith('/@')) {
        const newPath = '/@' + path.replace(/^\//, '')
        router.push(newPath);
        return null;
    }

    const segments = path.split('/');
    const id = segments[segments.length - 1] as string

    const { data, isLoading, isError } = api.post.getNestedThreads.useQuery({ id })

    if (isLoading) return <Loading />
    if (isError) return <NotFound />

    return (
        <>
            {data ? (
                <>
                    <ReplyThreadCard {...data} />
                    {data.threadInfo.replies.map((post, index) => (
                        <div key={index} className='mb-8'>
                            <Separator />
                            <ThreadCard {...post} />
                        </div>
                    ))}
                </>
            ) : (
                <NotFound />
            )}
        </>
    )
}

export default PostInfoPage
