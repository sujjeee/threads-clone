"use client"

import React from 'react'
import { api } from '@/trpc/react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ThreadCard from '@/components/threads/thread-card'
import { Icons } from '@/components/icons'
import CreateThread from '@/components/threads/create-thread'

import Loading from '@/app/(pages)/loading'
import NotFound from '../not-found'
import Error from '../error'

export default function page() {

  const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.infiniteFeed.useInfiniteQuery({}, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })

  const allThread = data?.pages.flatMap((page) => page.threads)

  if (isLoading) return <Loading />
  if (isError) return <Error />

  return (
    <div className=' z-[10] '>
      <CreateThread showIcon={false} />
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
        {allThread?.map((post) => {
          return (
            <ThreadCard key={post.id} {...post} />
          )
        })}
      </InfiniteScroll>
    </div>
  )
}