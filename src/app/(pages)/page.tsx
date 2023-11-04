"use client"

import React from 'react'
import { api } from '@/trpc/react'
import ThreadCard from '@/components/threads/thread-card'
import { Icons } from '@/components/icons'
import CreateThread from '@/components/threads/create-thread'
import Loading from '@/app/(pages)/loading'
import Error from '@/app/error'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Separator } from '@/components/ui/separator'

export default function page() {

  const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.infiniteFeed.useInfiniteQuery({}, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })

  const allThread = data?.pages.flatMap((page) => page.threads)

  if (isLoading) return <Loading />
  if (isError) return <Error />

  return (
    <>
      <div className='w-full sm:flex hidden'>
        <CreateThread showIcon={false} />
      </div>
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
              <ThreadCard key={index} {...post} />
              {index !== allThread.length - 1 && <Separator />}
            </>
          )
        })}
      </InfiniteScroll>
    </>
  )
}