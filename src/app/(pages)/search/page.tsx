"use client"

import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Icons } from '@/components/icons'
import UserCard from '@/components/user/user-action-card'
import Loading from '@/app/(pages)/loading'
import { api } from '@/trpc/react'
import Error from '@/app/error'
import SearchContainer from '@/components/search-container'
import PostCard from '@/components/cards/post-card'
import { redirect, useSearchParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'



const SearchPage: React.FC = ({ }) => {
    const searchParams = useSearchParams()
    const search = searchParams.get('q')

    const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.user.allUsers.useInfiniteQuery({}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        trpc: { abortOnUnmount: true }
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
                                    <div className="h-[100px] w-full justify-center items-center flex  mb-[10vh] sm:mb-0">
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
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        trpc: { abortOnUnmount: true },
        staleTime: Infinity
    })

    const allPosts = data?.pages.flatMap((page) => page.posts)

    if (isLoading) return <Loading />
    if (isError) return <Error />

    if (allPosts?.length === 0 || allPosts === undefined) {
        return (
            <div className="h-[50vh] w-full justify-center items-center flex text-[#777777]">
                <p>No users.</p>
            </div>
        )
    }

    return (
        <div className='mt-2'>
            <InfiniteScroll
                dataLength={allPosts ? allPosts.length : 0}
                next={fetchNextPage}
                hasMore={hasNextPage ?? false}
                loader={
                    <div className="h-[100px] w-full justify-center items-center flex  mb-[10vh] sm:mb-0">
                        <Icons.loading className='h-11 w-11' />
                    </div>
                }
            >
                {allPosts?.map((post, index) => {
                    return (
                        <div key={index} className={cn({ 'mb-[10vh]': index == allPosts.length - 1 })}>
                            <PostCard key={index} {...post} />
                            {index !== allPosts.length - 1 && <Separator />}
                        </div>
                    )
                })}
            </InfiniteScroll>
        </div>
    )
}
