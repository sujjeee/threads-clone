import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from '../icons';

export default function RepostButton(
    {
        id,
    }: {
        id: string
    }
) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit active:scale-95'>
                        <Icons.repost className='w-5 h-5 ' />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className='bg-[#181818] rounded-2xl w-[190px]  p-0'>
                    <DropdownMenuItem
                        className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px]  active:bg-[#0a0a0a] rounded-none w-full justify-between'
                    >
                        Repost
                        <Icons.repost className='w-5 h-5 ' />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className='bg-[#393939] h-[1.2px] my-0' />
                    <DropdownMenuItem
                        className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px] rounded-none active:bg-[#0a0a0a] w-full justify-between'
                    >
                        Quote
                        <Icons.quote className='w-5 h-5 ' />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
