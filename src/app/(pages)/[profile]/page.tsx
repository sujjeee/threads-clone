"use client"

import Post2 from 'tests/post2'
import { Instagram } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function page() {
    const path = usePathname()
    const router = useRouter()

    if (!path.startsWith('/@')) {
        const newPath = '/@' + path.replace(/^\//, '')
        router.push(newPath);
        return null;
    }

    return (
        <div className="container z-[10] mt-4 flex w-full max-w-[620px] flex-col px-6 space-y-4">
            <div className="flex w-fullitems-center">
                <div className="flex w-full flex-col p-3 pl-0 gap-1">
                    <h1 className="text-2xl font-medium tracking-normal">𝚂 𝚄 𝚁◬𝙹</h1>
                    <div className="flex gap-1">
                        <h4 className="text-[15px]">sujjeee</h4>
                        <span className="ml-0.5 rounded-2xl bg-[#1E1E1E] text-[#777777] text-xm px-1.5 py-1 text-[11px] font-medium">threads.net</span>
                    </div>
                </div>
                <div className="w-24">
                    <img src="https://avatar.vercel.sh/5" alt="" className="h-min w-full rounded-full object-cover border" />
                </div>
            </div>
            <p className='text-[15px]'>Naturally introvert selective extrovert. 👾</p>
            <div className='flex justify-between items-center'>
                <div className="hidden sm:flex -space-x-1 overflow-hidden w-full items-center ">
                    <img className="inline-block h-4 w-4 rounded-full ring-2 ring-background " src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" />
                    <img className="inline-block h-4 w-4 rounded-full ring-2 ring-background" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" />
                    <div className='pl-4 text-[#777777] text-[15px]'>8 followers</div>
                </div>
                <Instagram className='h-6 w-6' />
            </div>
            <div className="w-full mt-4 flex">
                <button className="w-full h-12 py-2 font-semibold border-b border-b-white text-center">
                    Threads
                </button>
                <Link
                    href={`/replies`}
                    className="flex items-center justify-center w-full h-12  font-medium border-b border-neutral-900 duration-200 hover:border-neutral-700 hover:text-neutral-500 text-center text-neutral-600"
                >
                    Replies
                </Link>
                <Link
                    href={`/replies`}
                    className="flex items-center justify-center w-full h-12 py-2 font-medium border-b border-neutral-900 duration-200 hover:border-neutral-700 hover:text-neutral-500 text-center text-neutral-600"
                >
                    Reposts
                </Link>
            </div>
            <Post2 />
        </div>

    )
}



