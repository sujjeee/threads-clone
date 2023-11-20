import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import type { AuthorInfoProps } from '@/types';
import QuoteButton from '@/components/buttons/quote-button';

interface RepostButtonProps {
    id: string
    text: string
    author: AuthorInfoProps
    isRepostedByMe: boolean
    createdAt?: Date
}

const RepostButton: React.FC<RepostButtonProps> = ({
    id,
    text,
    author,
    createdAt,
    isRepostedByMe
}) => {
    const repostUpdate = React.useRef({
        isRepostedByMe,
    });

    const { mutate: toggleRepost, isLoading } = api.post.toggleRepost.useMutation({
        onMutate: () => {

            const previousRepostByMe = repostUpdate.current.isRepostedByMe;

            repostUpdate.current.isRepostedByMe = !repostUpdate.current.isRepostedByMe;

            if (repostUpdate.current.isRepostedByMe === true) {
                toast('Reposted')
            } else {
                toast('Removed')
            }

            return { previousRepostByMe };

        },
        onError: (error, variables, context) => {
            repostUpdate.current.isRepostedByMe = context?.previousRepostByMe ?? repostUpdate.current.isRepostedByMe;
            toast.error("RepostError: Something went wrong!");
        },
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <button
                    disabled={isLoading}
                    className='flex items-center justify-center hover:bg-primary rounded-full p-2 w-fit h-fit active:scale-95 outline-none'>
                    {repostUpdate.current.isRepostedByMe
                        ? <Icons.reposted className='w-5 h-5 ' />
                        : <Icons.repost className='w-5 h-5 ' />
                    }
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className='bg-background shadow-xl dark:bg-[#181818] rounded-2xl w-[190px] p-0'>
                <DropdownMenuItem
                    disabled={isLoading}
                    onClick={() => {
                        toggleRepost({ id })
                    }}
                    className={cn('focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px]  active:bg-primary-foreground  rounded-none w-full justify-between', {
                        "text-red-600 focus:text-red-600": repostUpdate.current.isRepostedByMe
                    })}
                >

                    {repostUpdate.current.isRepostedByMe
                        ? <>Remove</>
                        : <>Repost</>
                    }

                    <Icons.repost className={cn('w-5 h-5 ', {
                        "text-red-600": repostUpdate.current.isRepostedByMe
                    })} />
                </DropdownMenuItem>
                <DropdownMenuSeparator className=' h-[1.2px] my-0' />
                <div className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px] rounded-none active:bg-primary-foreground  w-full justify-between'>
                    <QuoteButton
                        quoteInfo={{
                            text,
                            id,
                            author,
                            createdAt
                        }} />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default RepostButton
