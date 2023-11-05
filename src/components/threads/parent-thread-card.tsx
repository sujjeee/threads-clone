"use client"

import React from 'react'
import { Separator } from '../ui/separator'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Icons } from '../icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { ParentThreadCardProps } from '@/types'
import CreateThread from './create-thread'
import { useUser } from '@clerk/nextjs'

const ParentThreadCard: React.FC<ParentThreadCardProps> = (parentThread) => {
    if (!parentThread) {
        return null; // Handle the case when there's no parent thread.
    }

    const {
        id,
        text,
        author: {
            id: userId,
            createdAt,
            updatedAt,
            username,
            fullname,
            image,
            bio,
            link,
            email,
            verified,
            privacy,
        },
        likes,
        parentThread: parent,
        _count
    } = parentThread;


    const { user: loginUser } = useUser()
    const likedByMe = likes.some((like: any) => like?.userId || like?.user?.id === loginUser?.id);
    console.log('is liked my me ', likedByMe)
    console.log('ichecks all like ', likes)
    console.log('logged user', loginUser?.id)

    const likeUpdate = React.useRef({
        likedByMe,
        likeCount: _count.likes
    });

    const { mutate: toggleLike } = api.like.toggleLike.useMutation({

        onMutate: async ({ id }) => {
            // Save the current values for potential rollback
            const previousLikedByMe = likeUpdate.current.likedByMe;
            const previousLikeCount = likeUpdate.current.likeCount;

            likeUpdate.current.likedByMe = !likeUpdate.current.likedByMe;
            likeUpdate.current.likeCount = likeUpdate.current.likedByMe ? likeUpdate.current.likeCount + 1 : likeUpdate.current.likeCount - 1;


            return { previousLikedByMe, previousLikeCount };
        },
        onError: (error, variables, context) => {
            // Rollback to previous values
            likeUpdate.current.likedByMe = context?.previousLikedByMe!;
            likeUpdate.current.likeCount = context?.previousLikeCount!;

            toast.error("LikeCallBack: Something went wrong!")
        }
    });

    return (
        <>
            <div className='flex w-full gap-2'>
                <div className="flex flex-col items-center gap-1.5 z-50">
                    <button className='relative '>
                        <div className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full'>
                            <img
                                src={image}
                                alt="Account Avatar"
                                className="rounded-full w-full h-full "
                            />
                        </div>
                        <div className='bg-foreground absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-background'>
                            <Plus className='h-4 w-4 p-0.5' />
                        </div>
                    </button>
                    {/* {_count?.replies > 0 && <Icons.line className='h-full w-2' />} */}
                    {_count?.replies > 0 && <div className="h-full w-0.5 bg-muted rounded-full my-1.5" />}
                </div>
                <div className="flex flex-col w-full px-2">
                    <div className="justify-center items-start self-stretch flex flex-col max-md:max-w-full  ">
                        <div className="justify-center items-start flex w-full flex-col  pt-0 self-start">
                            <div className="items-start flex w-full justify-between gap-5 py-px self-start max-md:max-w-full max-md:flex-wrap z-50">
                                <span className="flex items-center justify-center gap-1.5 cursor-pointer">
                                    <h1 className="text-white text-[15px] font-semibold leading-[0px]">
                                        {username}
                                    </h1>
                                    <Icons.verified className='w-3 h-3' />
                                </span>
                                <div className="justify-between items-center self-stretch flex gap-2.5">
                                    <div className="text-right text-[15px] leading-none self-stretch  text-[#777777]"> 45m</div>
                                    <MoreHorizontal className='aspect-square object-cover object-center h-4 w-4 overflow-hidden flex-1' />
                                </div>
                            </div>
                            <Link href={`/@${username}/post/${id}`} className='w-full'>
                                <div className="text-white text-base leading-5 mt-1 max-md:max-w-full"> {parentThread.text} </div>
                            </Link>
                            <div className="flex  font-bold -ml-2 mt-2 w-full z-50">
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit'>
                                    <Icons.heart
                                        onClick={() => {
                                            toggleLike({ id })
                                        }}
                                        fill={likeUpdate.current.likedByMe ? '#ff3040' : 'none'}
                                        className={cn('w-5 h-5 ', {
                                            "text-[#ff3040]": likeUpdate.current.likedByMe
                                        }
                                        )} />
                                </div>
                                <CreateThread showIcon={true} replyThreadInfo={{
                                    id,
                                    text: parentThread.text,
                                    author: {
                                        id: id,
                                        image: image,
                                        username: username,
                                    }
                                }} />
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit'>
                                    <Icons.repost className='w-5 h-5 ' />
                                </div>
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 '>
                                    <Icons.share className='w-5 h-5 ' />
                                </div>
                            </div>
                            <Link href={`/@${username}/post/${id}`} className="flex items-center gap-2 text-[#777777] text-[15px] text-center z-50 pb-4">
                                {_count.replies > 0 && <p className='hover:underline '>{_count.replies} replies</p>}
                                {_count.replies > 0 && likeUpdate.current.likeCount > 0 && <p> · </p>}
                                {likeUpdate.current.likeCount > 0 &&
                                    <p className='hover:underline'>{likeUpdate.current.likeCount} likes</p>
                                }
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ParentThreadCard