"use client"

import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Icons } from '@/components/icons'
import UserCard from '@/components/user-card'
import Loading from '@/app/(pages)/loading'
import { api } from '@/trpc/react'
import Error from '@/app/error'

export default function page() {
    const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.getAllUsers.useInfiniteQuery({}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const allUsers = data?.pages.flatMap((page) => page.allUsers)

    if (isLoading) return <Loading />
    if (isError) return <Error />

    return (
        <div className=' z-[10] '>
            <div className="relative w-full flex border border-[#333333] px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground pl-14 rounded-2xl bg-black/40 h-[60px] text-[14px] mb-4 mt-1">
                <Icons.search className="h-4 w-4 text-[#4D4D4D] absolute left-6 -translate-y-2/4 top-2/4 " />
                <input
                    className=" mini-scrollbar resize-none bg-transparent w-full placeholder:text-[#777777] outline-none placeholder:text-[15px]"
                    placeholder="Search"
                />
            </div>
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
    )
}
