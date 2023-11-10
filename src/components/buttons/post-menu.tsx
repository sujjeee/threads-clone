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
import AreYouSure from '../are-you-sure';

interface PostMenuProps {
    threadId: string
    id: string
}

const PostMenu: React.FC<PostMenuProps> = ({ id, threadId }) => {
    const { user } = useUser()
    const isLoggedUser = id === user?.id
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='flex items-center justify-center relative hover:before:content-[""] hover:before:absolute hover:before:bg-primary hover:before:z-[-1] hover:before:-inset-2 hover:before:rounded-full cursor-pointer '>
                        <MoreHorizontal className='aspect-square object-cover object-center h-4 w-4 overflow-hidden flex-1  ' />
                    </div>
                </DropdownMenuTrigger>
                {!isLoggedUser
                    ? <DropdownMenuContent align="end" className='bg-background rounded-2xl w-[190px] mt-1 p-0'>
                        <DropdownMenuItem
                            className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px]  active:bg-primary rounded-none'
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
                            className='focus:bg-transparent px-4 tracking-normal select-none font-bold py-3 cursor-pointer text-[15px] text-red-700 focus:text-red-700 active:bg-primary-foreground rounded-none'
                        >
                            Report
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    : <DropdownMenuContent align="end" className='bg-background rounded-2xl w-[190px] mt-1 p-0'>
                        <DropdownMenuItem
                            className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px] active:bg-primary-foreground rounded-none'
                        >
                            Who can reply
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className=' h-[1.2px] my-0' />
                        <DropdownMenuItem
                            className='focus:bg-transparent px-4 tracking-normal  select-none font-semibold py-3 cursor-pointer text-[15px] rounded-none active:bg-primary-foreground '
                        >
                            Hide like count
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className=' h-[1.2px] my-0 ' />
                        <AreYouSure id={threadId} />
                    </DropdownMenuContent>
                }
            </DropdownMenu>
        </>
    )
}

export default PostMenu