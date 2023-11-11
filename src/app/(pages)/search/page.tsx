"use client"

import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Icons } from '@/components/icons'
import UserCard from '@/components/user-card'
import Loading from '@/app/(pages)/loading'
import { api } from '@/trpc/react'
import Error from '@/app/error'
import SearchContainer from '@/components/search-container'
import PostCard from '@/components/cards/post-card'
import { redirect, useSearchParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

interface pageProps { }

const SearchPage: React.FC<pageProps> = ({ }) => {
    const searchParams = useSearchParams()
    const search = searchParams.get('q')

    const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.user.allUsers.useInfiniteQuery({}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const allUsers = data?.pages.flatMap((page) => page.allUsers)

    if (isError) return <Error />

    return (
        <>
            <div className='relative mt-1'>
                <SearchContainer />
            </div>
            <div className='pt-16'>
                {!isLoading
                    ? <>
                        {search === null ? (
                            <InfiniteScroll
                                dataLength={allUsers ? allUsers.length : 0}
                                next={fetchNextPage}
                                hasMore={hasNextPage ?? false}
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
                            <DisplayQueryPosts searchQuery={search} />
                        )}
                    </>
                    : <Loading />
                }
            </div>
        </>
    )
}

export default SearchPage

interface DisplayQueryPostsProps {
    searchQuery: string
}

const DisplayQueryPosts: React.FC<DisplayQueryPostsProps> = ({ searchQuery }) => {

    if (searchQuery === '') redirect('/search')

    const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.getInfinitePost.useInfiniteQuery({ searchQuery }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const allThreads = data?.pages.flatMap((page) => page.threads)

    if (isLoading) return <Loading />
    if (isError) return <Error />

    if (allThreads?.length === 0 || allThreads === undefined) {
        return (
            <div className="h-[50vh] w-full justify-center items-center flex text-[#777777]">
                <p>No results.</p>
            </div>
        )
    }

    return (
        <div className='mt-2'>
            <InfiniteScroll
                dataLength={allThreads ? allThreads.length : 0}
                next={fetchNextPage}
                hasMore={hasNextPage ?? false}
                loader={
                    <div className="h-[100px] w-full justify-center items-center flex ">
                        <Icons.loading className='h-11 w-11' />
                    </div>
                }
            >
                {allThreads?.map((post, index) => {
                    return (
                        <>
                            <PostCard key={index} {...post} />
                            {index !== allThreads.length - 1 && <Separator />}
                        </>
                    )
                })}
            </InfiniteScroll>
        </div>
    )
}
