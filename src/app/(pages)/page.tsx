import Threads from '@/components/threads'
import { Button } from '@/components/ui/button'
import { currentUser } from '@clerk/nextjs'
import React from 'react'
import Post from 'tests/post'

export default function page() {
  const user = currentUser()
  return (
    <div className='container max-w-2xl '>
      <div className='flex w-full justify-between items-center px-2 py-4'>
        <div className='w-full flex '>
          <div>
            <img
              src='https://avatar.vercel.sh/1'
              width={35}
              height={35}
              alt="Account Avatar"
              className="rounded-full mr-4"
            />
          </div>
          <input id="post" className="bg-transparent text-xs border-none w-full focus:border-none ring-0 p-0 focus:ring-0 active:ring-0 outline-none border-0  focus:bg-transparent" type="text" name="post" />
        </div>
        <Button size={'sm'} className='rounded-full px-4 font-semibold'> Post</Button>
      </div>
      <Threads />
      <Post />
    </div>
  )
}
