"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '../icons'
import { useTheme } from 'next-themes'
import CreateThread from '../threads/create-thread'
import { cn } from '@/lib/utils'
import Navs from './navs'

export default function FooterNavs() {
    const path = usePathname()
    const { theme } = useTheme()

    function fillIcon(pathname: string) {
        return path === pathname ? 'white' : theme === "light" ? "white" : "#0F0F0F"
    }

    return (
        <div className="fixed sm:hidden bottom-0 left-0 z-50 w-full h-16 bg-[#101010D9] backdrop-blur-2xl">
            <div className="grid h-full grid-cols-5 mx-auto font-medium justify-around items-center gap-2 w-full px-2">
                <Link href={'/'} className="flex items-center justify-center px-5 hover:bg-[#1C1C1C]/80 py-5  rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90 w-full">
                    <Icons.home
                        className={cn(
                            "h-[26px] w-[26px]  text-lg",
                            path === '/'
                                ? "text-forground"
                                : "text-[#4D4D4D]",
                        )}
                        fill={fillIcon("/")}
                    />
                </Link>
                <Link href={'/'} className="flex items-center justify-center px-5 hover:bg-[#1C1C1C]/80 py-5  rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90 w-full">
                    <Icons.search
                        className={cn(
                            "h-6 w-6 text-lg",
                            path === '/search'
                                ? "text-forground"
                                : "text-[#4D4D4D]",
                        )}
                    />
                </Link>
                <CreateThread showIcon={true} />
                <Link href={'/'} className="flex items-center justify-center px-5 hover:bg-[#1C1C1C]/80 py-5  rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90 w-full">
                    <Icons.like
                        className={cn(
                            "h-6 w-6",
                            path === '/activity'
                                ? "text-forground"
                                : "text-[#4D4D4D]",
                        )}
                        fill={fillIcon("/activity")}
                    />
                </Link>
                <Link href={'/'} className="flex items-center justify-center px-5 hover:bg-[#1C1C1C]/80 py-5  rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90 w-full">
                    <Icons.profile
                        className={cn(
                            "h-6 w-6",
                            path === '/profile'
                                ? "text-forground"
                                : "text-[#4D4D4D]",
                        )}
                        fill={fillIcon("/profile")}
                    />
                </Link>
                <Navs />
            </div>
        </div>

    )
}