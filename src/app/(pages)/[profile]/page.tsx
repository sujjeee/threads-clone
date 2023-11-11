"use client"

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { api } from '@/trpc/react'
import UserProfile from '@/components/user-profile'
import Loading from '../loading'
import ThreadCard from '@/components/threads/thread-card'
import { Separator } from '@/components/ui/separator'
import NotFound from '@/app/not-found'

export default function page() {
  const path = usePathname()
  const router = useRouter()
  const username = path.substring(2);

  if (path.length < 20 && !path.startsWith('/@')) {
    const newPath = '/@' + path.replace(/^\//, '')
    router.push(newPath);
    return null;
  }

  const { data, isLoading, isError } = api.user.profileInfo.useQuery({ username })

  if (isLoading) return <Loading />
  if (isError) return <NotFound />

  return (
    <div>
      <UserProfile {...data.userDetails} />
      {data && data.threads.map((threads, index) => {
        return (
          <>
            <ThreadCard key={threads.id} {...threads} />
            {index !== data.threads.length - 1 && <Separator />}
          </>
        )
      })}
    </div>
  )
}





