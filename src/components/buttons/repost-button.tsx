import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { toast } from 'sonner';

interface RepostButtonProps {
    id: string
    isRepostedByMe: boolean
}

const RepostButton: React.FC<RepostButtonProps> = ({
    id,
    isRepostedByMe
}) => {

    const repostUpdate = React.useRef({
        isRepostedByMe,
    });

    const { mutate: toggleRepost, isLoading } = api.post.toggleRepost.useMutation({
        onMutate: async () => {

            const previousRepostByMe = repostUpdate.current.isRepostedByMe;

            repostUpdate.current.isRepostedByMe = !repostUpdate.current.isRepostedByMe;


            return { previousRepostByMe };

        },
        onError: (error, variables, context) => {

            repostUpdate.current.isRepostedByMe = context?.previousRepostByMe!;
            toast.error("RepostError: Something went wrong!")

        },
        onSuccess: (data) => {
            if (!data.createdRepost) {
                toast('Removed')
            } else {
                toast('Reposted')
            }
        }
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild >
                    <button
                        disabled={isLoading}
                        className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit active:scale-95'>
                        {repostUpdate.current.isRepostedByMe
                            ? <Icons.reposted className='w-5 h-5 ' />
                            : <Icons.repost className='w-5 h-5 ' />
                        }
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className='bg-[#181818] rounded-2xl w-[190px]  p-0'>
                    <DropdownMenuItem
                        disabled={isLoading}
                        onClick={() => {
                            toggleRepost({ id })
                        }}
                        className={cn('focus:bg-transparent px-4 tracking-normal select-none font-semibold py-3 cursor-pointer text-[15px]  active:bg-[#0a0a0a] rounded-none w-full justify-between', {
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

export default RepostButton