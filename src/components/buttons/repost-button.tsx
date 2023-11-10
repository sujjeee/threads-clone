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
import CreateThread from '@/components/threads/create-thread';
import { AuthorInfoProps } from '@/types';

interface RepostButtonProps {
    id: string
    text: string
    author: AuthorInfoProps
    isRepostedByMe: boolean
}

const RepostButton: React.FC<RepostButtonProps> = ({
    id,
    text,
    author,
    isRepostedByMe
}) => {

    const repostUpdate = React.useRef({
        isRepostedByMe,
    });

    const { mutate: toggleRepost, isLoading } = api.post.toggleRepost.useMutation({
        onMutate: async () => {

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

            repostUpdate.current.isRepostedByMe = context?.previousRepostByMe!;
            toast.error("RepostError: Something went wrong!")

        },
    });

    return (
        <>
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
                <DropdownMenuContent align="start" className='bg-background rounded-2xl w-[190px] p-0'>
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
                        <CreateThread
                            variant='quote'
                            quoteInfo={{
                                text,
                                id,
                                author
                            }} />
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default RepostButton
