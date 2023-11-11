"use client"

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { api } from '@/trpc/react'
import UserProfile from '@/components/user-profile'
import Loading from '@/app/loading'
import PostCard from '@/components/cards/post-card'
import { Separator } from '@/components/ui/separator'
import NotFound from '@/app/not-found'

interface pageProps { }

const ProfilePage: React.FC<pageProps> = ({ }) => {

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
      {data && data.userDetails ? (
        <>
          <UserProfile {...data.userDetails} />
          {data.threads.map((threads, index) => (
            <div key={threads.id}>
              <PostCard {...threads} />
              {index !== data.threads.length - 1 && <Separator />}
            </div>
          ))}
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );

}

export default ProfilePage