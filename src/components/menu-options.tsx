import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Icons } from './icons'

export default function MenuOptions() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Icons.menu className='h-6 w-6 text-[#4B4B4B] hover:text-white cursor-pointer' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='bg-[#181818] rounded-2xl max-w-sm w-full'>
                <DropdownMenuItem className='focus:bg-transparent px-5 tracking-normal font-semibold py-2'>
                    Switch appearance
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-muted h-[1.2px] ' />
                <DropdownMenuItem className='focus:bg-transparent px-5 tracking-normal font-semibold py-2'>
                    About
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-muted h-[1.2px]' />
                <DropdownMenuItem className='focus:bg-transparent px-5 tracking-normal font-semibold py-2'>
                    Report a problem
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-muted h-[1.2px]' />
                <DropdownMenuItem className='focus:bg-transparent px-5 tracking-normal font-semibold py-2'>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
