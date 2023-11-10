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
            <div className="grid h-full grid-cols-5 mx-auto w-full">
                <Navs />
            </div>
        </div>

    )
}