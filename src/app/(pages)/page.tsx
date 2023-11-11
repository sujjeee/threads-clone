"use client"

import React from 'react'
import { api } from '@/trpc/react'
import PostCard from '@/components/cards/post-card'
import { Icons } from '@/components/icons'
import CreatePostCard from '@/components/cards/create-post-card'
import Loading from '@/app/loading'
import Error from '@/app/error'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export default function page() {

  const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.getInfinitePost.useInfiniteQuery({}, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })

  const allThreads = data?.pages.flatMap((page) => page.threads)

  if (isLoading) return <Loading />
  if (isError) return <Error />

  return (
    <>
      <div className='w-full sm:flex hidden'>
        <CreatePostCard variant='home' />
      </div>
      <InfiniteScroll
        dataLength={allThreads?.length ?? 0}
        next={fetchNextPage}
        hasMore={hasNextPage ?? false}
        loader={
          <div className="h-[100px] w-full justify-center items-center flex  mb-[10vh] sm:mb-0">
            <Icons.loading className='h-11 w-11' />
          </div>
        }
      >
        <div>
          {allThreads?.map((post, index) => {
            return (
              <div key={index} className={cn({ 'mb-[10vh]': index == allThreads.length - 1 })}>
                <PostCard {...post} />
                {index !== allThreads.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </>
  )
}