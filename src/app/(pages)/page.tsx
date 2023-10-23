import { currentUser } from '@clerk/nextjs'
import React from 'react'
import Post from '@/components/post'
import NewThreadModal from '@/components/new-thread-modal'
import Post2 from '@/components/post2'
import { redirect } from 'next/navigation'
import { getUserEmail } from '@/lib/utils'
import { db } from '@/server/db'

export default async function page() {

  const user = await currentUser()
  if (!user || !user.id) redirect('/login')

  const email = getUserEmail(user)

  const dbUser = await db.user.findUnique({
    where: {
      email: email
    },
    select: {
      id: true
    }
  })

  if (!dbUser) redirect('/account?origin=/')

  return (
    <div className='container max-w-[620px] z-[10] px-6'>
      <NewThreadModal showIcon={false} />
      <Post2 />
      <Post />
    </div>
  )
}
