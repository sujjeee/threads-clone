"use client"

import React from 'react'
import { Icons } from '../icons'
import Navs from './navs'
import useWindow from '@/hooks/use-window'
import FooterNavs from './footer-navs'
import MenuOptions from '../menu-options'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'


export default function SiteHeader() {
    const { isMobile } = useWindow()
    const [isScrolled, setIsScrolled] = React.useState(false)

    // change background color on scroll
    React.useEffect(() => {
        const changeBgColor = () => {
            window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false)
        }
        window.addEventListener("scroll", changeBgColor)
        return () => window.removeEventListener("scroll", changeBgColor)
    }, [isScrolled])

    return (
        isMobile
            ? <FooterNavs />
            : <header
                aria-label="Header"
                className={cn(
                    "sticky top-0 z-50 w-full",
                    isScrolled ? "bg-[#0F0F0F]/90  backdrop-blur-2xl" : "bg-transparent"
                )}
            >
                {/* <nav className=" max-w-screen-2xl ">
                    <div className="container flex w-full h-16 items-center justify-between space-x-4 sm:space-x-0">

                        
                    </div>
                </nav> */}
                <nav className="md:container md:max-w-[1250px] ">
                    <div className="py-1 flex w-full justify-between items-center z-50">
                        <h2 className="text-2xl font-semibold tracking-wide flex gap-2.5 items-center ">
                            <Icons.logo className='h-[34px] w-[34px]' />
                        </h2>
                        <Navs />
                        <MenuOptions />
                    </div>
                </nav>
            </header>
    )
}