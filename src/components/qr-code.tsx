"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import useWindow from '@/hooks/use-window'

export default function QRcode() {
    const { isMobile } = useWindow()
    return (
        isMobile ? null : (
            <div className="fixed right-10 bottom-10 flex flex-col justify-center items-center gap-5 z-50  scale-75 lg:scale-100">
                <p className="text-muted-foreground text-xs tracking-wide">Scan to get the app</p>
                <Card className='cursor-pointer border border-[#333333] z-50 rounded-2xl p-2 bg-[#181818] transform active:scale-95 transition-transform select-none'>
                    <object data="threads.svg" width={150} height={150} />
                </Card>
            </div>
        )
    );
}
