"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import useWindow from '@/hooks/use-window'
import QRSvg from './qr-svg'
import { Zoom } from './zoom'


export default function QRcode() {
    const { isMobile } = useWindow()
    return (
        isMobile ? null : (
            <div className="fixed right-2 bottom-2 lg:right-10 lg:bottom-10 flex flex-col justify-center items-center gap-5 z-50  scale-75 lg:scale-100">
                <p className="text-[#777777] text-[13px] tracking-wide">Scan to get the code</p>
                <div className='hover:scale-105 transform active:scale-95 transition-transform select-none '>
                    <Zoom>
                        <QRSvg className=' w-[175px] h-[175px]  p-1 cursor-pointer border border-[#393939] z-50 rounded-2xl bg-[#181818] ' />
                    </Zoom>
                </div>
            </div>
        )
    );
}
