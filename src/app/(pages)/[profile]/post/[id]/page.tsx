"use client"

import React from 'react'
import Loading from '@/app/loading'
import NotFound from '@/app/not-found'
import PostReplyCard from '@/components/cards/post-reply-card'
import PostCard from '@/components/cards/post-card'
import { api } from '@/trpc/react'
import { Separator } from '@/components/ui/separator'
import { usePathname, useRouter } from 'next/navigation'

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

    const { data, isLoading, isError } = api.post.getNestedPosts.useQuery({ id })

    if (isLoading) return <Loading />
    if (isError) return <NotFound />

    return (
        <>
            {data ? (
                <>
                    <PostReplyCard {...data} />
                    {data.postInfo.replies.map((post, index) => (
                        <div key={index} className='mb-8'>
                            <Separator />
                            <PostCard {...post} />
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
