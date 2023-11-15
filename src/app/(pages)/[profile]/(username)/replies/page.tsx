"use client"

import React from 'react'
import { api } from '@/trpc/react'
import PostCard from '@/components/cards/post-card'
import { Separator } from '@/components/ui/separator'
import NotFound from '@/app/not-found'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import { Icons } from '@/components/icons'

const RepliesPage: React.FC = ({ }) => {
    const params = useParams()
    const profile = params.profile as string
    const username = decodeURIComponent(profile).substring(1)

    const { data, isLoading, isError } = api.user.repliesInfo.useQuery({ username })

    if (isLoading) {
        return (
            <div className="h-[100px] w-full justify-center items-center flex  mb-[10vh] sm:mb-0">
                <Icons.loading className='h-11 w-11' />
            </div>
        )
    }

    if (isError) return <NotFound />

    return (
        <div>
            {data ? (
                data?.length > 0 ? (
                    data.map((post, index) => (
                        <div key={post.id} className={cn({ 'mb-[10vh]': index == data.length - 1 })}>
                            <PostCard {...post} />
                            {index !== data.length - 1 && <Separator />}
                        </div>
                    ))
                ) : (
                    <div className="h-[50vh] w-full justify-center items-center flex text-[#777777]">
                        <p>No replies yet.</p>
                    </div>
                )
            ) : (
                <NotFound />
            )}
        </div>
    );
}

export default RepliesPage