"use client"

import React from 'react'
import Loading from '@/app/(pages)/loading'
import NotFound from '@/app/not-found'
import PostReplyCard from '@/components/cards/post-reply-card'
import PostCard from '@/components/cards/post-card'
import { api } from '@/trpc/react'
import { Separator } from '@/components/ui/separator'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const PostInfoPage: React.FC = ({ }) => {

    const params = useParams()
    const id = params.id as string

    const { data, isLoading, isError } = api.post.getNestedPosts.useQuery({ id })

    if (isLoading) return <Loading />
    if (isError) return <NotFound />

    return (
        <>
            {data ? (
                <>
                    <PostReplyCard {...data} key={data.postInfo.id} />
                    {data.postInfo.replies.map((post, index) => (
                        <div key={index} className={cn({ 'mb-[10vh]': index == data.postInfo.replies.length - 1 })}>
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
