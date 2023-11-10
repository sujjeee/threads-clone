"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '../icons'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import CreateThread from '../threads/create-thread'
import { useUser } from '@clerk/nextjs'

export default function Navs() {
    const { user } = useUser()
    const path = usePathname()

    return (
        <>
            <Link href={'/'} className='hover:bg-[#1C1C1C]/80 p-4 sm:py-5 sm:px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90 flex items-center justify-center w-full'>
                <Icons.home
                    className={cn(
                        "h-[26px] w-[26px]  text-lg",
                        path === '/' ? "text-foreground" : "text-[#4d4d4d]"
                    )}
                    stroke='red'
                    fill={path === '/' ? 'currentColor' : 'transparent'}
                />
            </Link>
            <Link href={'/search'} className='hover:bg-[#1C1C1C]/80 p-4  sm:py-5 sm:px-8  rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90 flex items-center justify-center w-full'>
                <Icons.search
                    className={cn(
                        "h-6 w-6 text-lg",
                        path === '/search' ? "text-foreground" : "text-[#4d4d4d]"
                    )}
                />
            </Link>
            <CreateThread variant='create' />
            <Link href={'/activity'} className='hover:bg-[#1C1C1C]/80 p-4  sm:py-5 sm:px-8  rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90 flex items-center justify-center w-full'>
                <Icons.activity
                    className={cn(
                        "h-6 w-6",
                        path === '/activity' ? "text-foreground" : "text-[#4d4d4d]"
                    )}
                    fill={path === '/activity' ? 'currentColor' : 'transparent'}
                />
            </Link>
            <Link href={`/@${user?.username}`} className='hover:bg-[#1C1C1C]/80 p-4  sm:py-5 sm:px-8  rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90 flex items-center justify-center w-full'>
                <Icons.profile
                    className={cn(
                        "h-[26px] w-[26px]",
                        path.startsWith('/@') ? "text-foreground" : "text-[#4d4d4d]"
                    )}
                    fill={path.startsWith('/@') ? 'currentColor' : 'transparent'}
                />
            </Link>
        </>
    )
}