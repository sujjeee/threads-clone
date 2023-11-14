"use client"

import React from 'react'
import { Icons } from '@/components/icons'
import Navigation from '@/components/navigations'
import useWindow from '@/hooks/use-window'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import NavigationMenu from '@/components/menus/navigation-menu'


export default function SiteHeader() {
    const { isMobile } = useWindow()
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const changeBgColor = () => {
            window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false)
        }
        window.addEventListener("scroll", changeBgColor)
        return () => window.removeEventListener("scroll", changeBgColor)
    }, [isScrolled])

    return (
        <header
            aria-label="Header"
            className={cn(
                "sticky top-0 z-[100] w-full",
                isScrolled ? "dark:bg-[#101010D9] bg-background backdrop-blur-2xl" : "bg-transparent"
            )}
        >
            <nav className="sm:container sm:max-w-[1250px] px-4 ">
                <div className="relative py-1 flex w-full justify-between items-center z-50 max-h-[60px] sm:max-h-full h-full">
                    <Link href={'/'} className="text-2xl font-semibold tracking-wide flex gap-2.5 items-center cursor-pointer active:scale-95  transform transition-all duration-150 ease-out hover:scale-105 z-[50] w-full sm:w-fit py-4 justify-center ">
                        <Icons.logo className='h-[34px] w-[34px]' />
                    </Link>
                    <div className='hidden sm:flex justify-between items-center max-w-[480px] w-full '>
                        <Navigation />
                    </div>
                    {isMobile
                        ? <div className='absolute right-0 -translate-y-2/4 top-2/4 z-[999]'>
                            <NavigationMenu />
                        </div>
                        : <NavigationMenu />
                    }
                </div>
            </nav>
        </header>
    )
}
