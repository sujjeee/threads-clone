"use client"

import React from 'react'
import { api } from '@/trpc/react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ThreadCard from '@/components/threads/thread-card'
import { Icons } from '@/components/icons'
import CreateThread from '@/components/threads/create-thread'

import Loading from '@/app/(pages)/loading'
import { useUser } from '@clerk/nextjs'

export default function page() {
    const { user } = useUser()
    if (!user) return
    return (
        <ShowThreads />
    )
}

interface ShowThreadsProps { }

const ShowThreads: React.FC<ShowThreadsProps> = ({ }) => {

    const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.getInfinitePost.useInfiniteQuery({}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const allThread = data?.pages.flatMap((page) => page.threads)

    if (isLoading) return <Loading />
    if (isError) return <h1>Error...</h1>;

    return (
        <div className=' z-[10] '>
            <CreateThread showIcon={false} />
            <InfiniteScroll
                dataLength={allThread?.length!}
                next={fetchNextPage}
                hasMore={hasNextPage!}
                loader={<Icons.spinner className='h-8 w-8' />}
            >
                {allThread?.map((post) => {
                    return (
                        <ThreadCard key={post.id} {...post} />
                    )
                })}
            </InfiniteScroll>
        </div>
    )
}
