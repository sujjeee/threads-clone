"use client"

import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Icons } from '@/components/icons'
import UserCard from '@/components/user-card'
import Loading from '@/app/(pages)/loading'
import { api } from '@/trpc/react'
import Error from '@/app/error'
import SearchContainer from '@/components/search-container'

export default function page() {
    const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.getAllUsers.useInfiniteQuery({}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const allUsers = data?.pages.flatMap((page) => page.allUsers)

    if (isLoading) return <Loading />
    if (isError) return <Error />

    return (
        <>
            <SearchContainer />
            <div className='pt-16'>
                <InfiniteScroll
                    dataLength={allUsers?.length!}
                    next={fetchNextPage}
                    hasMore={hasNextPage!}
                    loader={
                        <div className="h-[100px] w-full justify-center items-center flex ">
                            <Icons.loading className='h-11 w-11' />
                        </div>
                    }
                >
                    {allUsers?.map((user) => {
                        return (
                            <UserCard key={user.id} {...user} />
                        )
                    })}
                </InfiniteScroll>
            </div>
        </>
    )
}
