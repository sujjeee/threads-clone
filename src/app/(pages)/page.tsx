"use client"

import React from 'react'
import { api } from '@/trpc/react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ThreadCard from '@/components/threads/thread-card'
import { Icons } from '@/components/icons'
import CreateThread from '@/components/threads/create-thread'
import Loading from './loading'

export default function page() {

  const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.infiniteFeed.useInfiniteQuery({}, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })


  const allThread = data?.pages.flatMap((page) => page.threads)

  // console.log("allThread", allThread)
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