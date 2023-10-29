"use client"

import React from 'react'
import { api } from '@/trpc/react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ThreadCard from '@/components/threads/thread-card'
import { Icons } from '@/components/icons'
import CreateThread from '@/components/threads/create-thread'

export default function page() {

  const { data, isLoading, isError, hasNextPage, fetchNextPage } = api.post.infiniteFeed
    .useInfiniteQuery({}, {
      getNextPageParam: (lastPage) => lastPage.nextCursor
    })

  const allThread = data?.pages.flatMap((page) => page.threads)

  console.log("allThread", allThread)
  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Error...</h1>;

  return (
    <div className='container max-w-[620px] z-[10] px-6'>
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

// function RecentTweets() {
//   const tweets = aawaitpi.thre
//   { getNextPageParam: (lastPage) => lastPage.nextCursor }
//   );

//   return (
//     <InfiniteTweetList
//       tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
//       isError={tweets.isError}
//       isLoading={tweets.isLoading}
//       hasMore={tweets.hasNextPage}
//       fetchNewTweets={tweets.fetchNextPage}
//     />
//   );
// }

{/* <CreateThread showIcon={false} />
      <ThreadCard />
      <Post2 />
      <Post /> */}