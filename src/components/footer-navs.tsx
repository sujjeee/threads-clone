"use client"

import React from 'react'
import Navs from '@/components/navs'

export default function FooterNavs() {
    return (
        <div className="fixed sm:hidden bottom-0 left-0 z-50 w-full h-16 bg-[#101010D9] backdrop-blur-2xl">
            <div className="grid h-full grid-cols-5 mx-auto w-full">
                <Navs />
            </div>
        </div>

    )
}