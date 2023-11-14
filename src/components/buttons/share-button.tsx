import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from '@/components/icons';

interface ShareButtonProps {
    id: string
    author: string
}

const ShareButton: React.FC<ShareButtonProps> = ({ id, author }) => {

    const copyLinkToClipboard = async () => {
        const url = window.location.origin;
        const link = `${url}/@${author}/post/${id}`;

        await navigator.clipboard.writeText(link);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='flex items-center justify-center hover:bg-primary rounded-full p-2 w-fit h-fit active:scale-95'>
                    <Icons.share className='w-5 h-5 ' />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className='bg-background shadow-xl dark:bg-[#181818] rounded-2xl w-[190px]  p-0'>
                <DropdownMenuItem
                    onClick={copyLinkToClipboard}
                    className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px]  active:bg-primary-foreground  rounded-none'
                >
                    Copy link
                </DropdownMenuItem>
                <DropdownMenuSeparator className='h-[1.2px] my-0' />
                <DropdownMenuItem
                    onClick={copyLinkToClipboard}
                    className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px] rounded-none active:bg-primary-foreground '
                >
                    Copy embed code
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ShareButton