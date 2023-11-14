"use client"

import useWindow from '@/hooks/use-window'
import React from 'react'
import { Icons } from '@/components/icons'
import Image from 'next/image'

export default function ThreadsBanner() {
    const { isMobile } = useWindow()
    return (
        <header className="max-w-screen-md  md:max-w-screen-2xl lg:max-w-[1800px] mx-auto">
            {isMobile ?
                <div className='flex justify-center items-center '>
                    <Icons.logo className='h-10 w-10 mb-6 sm:h-16 sm:w-16 mt-16' />
                </div>
                :
                <nav className='flex w-full justify-between items-center z-50 pointer-events-none select-none'>
                    <Image
                        width={1000}
                        height={1000}
                        src="/bg.webp"
                        alt="Background"
                        className="w-full h-[500px] object-cover"
                        unoptimized
                        priority
                    />
                </nav>
            }
        </header>
    )
}

