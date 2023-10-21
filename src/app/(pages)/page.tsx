import Threads from '@/components/threads'
import { Button } from '@/components/ui/button'
import { currentUser } from '@clerk/nextjs'
import React from 'react'
import Post from '@/components/post'
import NewThreadModal from '@/components/new-thread-modal'
import MenuOptions from '@/components/menu-options'

export default function page() {
  const user = currentUser()
  return (
    <div className='container max-w-[620px] z-[10] px-6'>
      <NewThreadModal showIcon={false} />
      {/* <Threads /> */}
      <Post />

      {/* <Post /> */}
    </div>
    // <MenuOptions />
  )
}
