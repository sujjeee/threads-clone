"use client"

import React from 'react'
import { Icons } from '../icons'
import Navs from './navs'
import useWindow from '@/hooks/use-window'
import FooterNavs from './footer-navs'


export default function SiteHeader() {
    const { isDesktop } = useWindow()
    return (
        isDesktop
            ? <header
                aria-label="Header"
                className="backdrop-blur-xl shadow-md z-40 w-full "
            >
                <nav className=" md:container md:max-w-screen-xl px-4">
                    <div className="py-1 flex w-full justify-between items-center z-50">
                        <h2 className="text-2xl font-semibold tracking-wide flex gap-2.5 items-center ">
                            <Icons.logo className='h-9 w-9' />
                        </h2>
                        <Navs />
                        <Icons.menu className='h-6 w-6 text-[#4B4B4B] hover:text-white cursor-pointer' />
                    </div>
                </nav>
            </header>
            : <FooterNavs />
    )
}