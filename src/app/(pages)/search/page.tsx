"use client"

import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Icons } from '@/components/icons'
import UserCard from '@/components/user-card'
import Loading from '@/app/(pages)/loading'
import { api } from '@/trpc/react'
import Error from '@/app/error'
import SearchContainer from '@/components/search-container'
import ThreadCard from '@/components/threads/thread-card'
import { useSearchParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

export default function page() {

    const searchParams = useSearchParams()
    const search = searchParams.get('q')

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
                {search === null ? (
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
                ) : (
                    <DisplayQueryThreads searchQuery={search} />
                )}
            </div>
        </>
    )
}


interface DisplayQueryThreadsProps {
    searchQuery: string
}

const DisplayQueryThreads: React.FC<DisplayQueryThreadsProps> = ({ searchQuery }) => {

    const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.infiniteFeed.useInfiniteQuery({ searchQuery }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    console.log('searchQuery', searchQuery)
    console.log('data', data?.pages[0]?.threads)
    const allThread = data?.pages.flatMap((page) => page.threads)
    console.log('structure all threds', allThread)
    if (isLoading) return <Loading />
    if (isError) return (
        <div className="h-[100px] w-full justify-center items-center flex ">
            <p>No results.</p>
        </div>
    )
    if (allThread?.length === 0 || allThread === undefined) {
        return (
            <div className="h-[50vh] w-full justify-center items-center flex text-[#777777]">
                <p>No results.</p>
            </div>
        )
    }
    return (
        <div className='mt-2'>
            <InfiniteScroll
                dataLength={allThread?.length!}
                next={fetchNextPage}
                hasMore={hasNextPage!}
                loader={
                    <div className="h-[100px] w-full justify-center items-center flex ">
                        <Icons.loading className='h-11 w-11' />
                    </div>
                }

            >
                {allThread?.map((post, index) => {
                    return (
                        <>
                            <ThreadCard
                                key={index}
                                {...post}
                            />

                        </>
                    )
                })}
            </InfiniteScroll>
        </div>
    )
}
