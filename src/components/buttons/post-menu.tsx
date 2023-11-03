import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function PostMenu(
    { id }: { id: string }
) {
    const { user } = useUser()
    const isLoggedUser = id === user?.id
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='flex items-center justify-center relative hover:before:content-[""] hover:before:absolute hover:before:bg-[#1E1E1E] hover:before:z-[-1] hover:before:-inset-2 hover:before:rounded-full cursor-pointer '>
                        <MoreHorizontal className='aspect-square object-cover object-center h-4 w-4 overflow-hidden flex-1  ' />
                    </div>
                </DropdownMenuTrigger>
                {!isLoggedUser
                    ? <DropdownMenuContent align="end" className='bg-[#181818] rounded-2xl w-[190px] mt-1 p-0'>
                        <DropdownMenuItem
                            className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px]  active:bg-[#0a0a0a] rounded-none'
                        >
                            Mute
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className='bg-[#393939] h-[1.2px] my-0' />
                        <DropdownMenuItem
                            className='focus:bg-transparent px-4 tracking-normal  select-none font-bold py-3 cursor-pointer text-[15px] text-red-700 focus:text-red-700 rounded-none active:bg-[#0a0a0a]'
                        >
                            Block
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className='bg-[#393939] h-[1.2px] my-0' />
                        <DropdownMenuItem
                            className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px] rounded-none active:bg-[#0a0a0a]'
                        >
                            Hide
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className='bg-[#393939] h-[1.2px] my-0 ' />
                        <DropdownMenuItem
                            className='focus:bg-transparent px-4 tracking-normal select-none font-bold py-3 cursor-pointer text-[15px] text-red-700 focus:text-red-700 active:bg-[#0a0a0a] rounded-none'
                        >
                            Report
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    : <DropdownMenuContent align="end" className='bg-[#181818] rounded-2xl w-[190px] mt-1 p-0'>
                        <DropdownMenuItem
                            className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px]  active:bg-[#0a0a0a] rounded-none'
                        >
                            Who can reply
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className='bg-[#393939] h-[1.2px] my-0' />
                        <DropdownMenuItem
                            className='focus:bg-transparent px-4 tracking-normal  select-none font-semibold py-3 cursor-pointer text-[15px] rounded-none active:bg-[#0a0a0a]'
                        >
                            Hide like count
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className='bg-[#393939] h-[1.2px] my-0 ' />
                        <DropdownMenuItem
                            className='focus:bg-transparent px-4 tracking-normal select-none font-bold py-3 cursor-pointer text-[15px] text-red-700 focus:text-red-700 active:bg-[#0a0a0a] rounded-none'
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                }
            </DropdownMenu>
        </>
    )
}
