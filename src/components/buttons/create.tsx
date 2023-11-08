"use client"

import React from 'react'
import { Icons } from '../icons'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export default function Create() {
    const path = usePathname()
    return (
        <div className="flex items-center justify-center px-5 hover:bg-[#1C1C1C]/80 py-5 rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90 w-full">
            <Icons.create
                className={cn(
                    "h-6 w-6",
                    path === '/create'
                        ? "text-forground"
                        : "text-[#4D4D4D]",
                )}
            />
        </div>
    )
}
