"use client"

import { Icons } from '@/components/icons'
import UserCard from '@/components/user-card'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loading from '../loading'
import { api } from '@/trpc/react'

export default function page() {
    const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.getAllUsers.useInfiniteQuery({}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })


    const allUsers = data?.pages.flatMap((page) => page.allUsers)

    // console.log("allThread", allThread)
    if (isLoading) return <Loading />
    if (isError) return <h1>Error...</h1>;

    return (
        <div className=' z-[10] '>
            <InfiniteScroll
                dataLength={allUsers?.length!}
                next={fetchNextPage}
                hasMore={hasNextPage!}
                loader={<Icons.spinner className='h-8 w-8' />}
            >
                {allUsers?.map((user) => {
                    return (
                        <UserCard key={user.id} {...user} />
                    )
                })}
            </InfiniteScroll>
        </div>
    )
}
