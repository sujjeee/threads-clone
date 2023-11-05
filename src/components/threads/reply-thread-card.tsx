"use client"

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Icons } from '@/components/icons'
import { api } from '@/trpc/react'
import { cn, formatTimeAgo } from '@/lib/utils'
import CreateThread from '@/components/threads/create-thread'
import Link from 'next/link'
import { ThreadProps } from '@/types'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'
import Username from '@/components/threads/username'
import PostMenu from '@/components/buttons/post-menu'
import ThreadCard from './thread-card'

const ReplyThreadCard: React.FC<ThreadProps> = ({ threadInfo }) => {

    const { user: loginUser } = useUser()
    const { id, likes, replies, author, count, createdAt, parentThreadId, text } = threadInfo

    const likedByMe = likes.some((like: any) => like.userId === loginUser?.id);

    const likeUpdate = React.useRef({
        likedByMe,
        likeCount: likes.length
    });

    const { mutate: toggleLike } = api.like.toggleLike.useMutation({

        onMutate: async ({ id }) => {

            const previousLikedByMe = likeUpdate.current.likedByMe;
            const previousLikeCount = likeUpdate.current.likeCount;

            likeUpdate.current.likedByMe = !likeUpdate.current.likedByMe;
            likeUpdate.current.likeCount = likeUpdate.current.likedByMe ? likeUpdate.current.likeCount + 1 : likeUpdate.current.likeCount - 1;

            return { previousLikedByMe, previousLikeCount };
        },
        onError: (error, variables, context) => {

            likeUpdate.current.likedByMe = context?.previousLikedByMe!;
            likeUpdate.current.likeCount = context?.previousLikeCount!;

            toast.error("LikeCallBack: Something went wrong!")
        }
    });
    return (
        <>
            <div className='flex flex-col w-full pt-2'>
                {/* {getThreadParents?.map((post,index) => (
                    <>
                    <ThreadCard
                        key={index}
                        {...post}
                    />
                    </>
                ))} */}
                <div className="flex items-center gap-3 z-50 w-full pr-2 ">
                    <button className='relative '>
                        <div className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full ml-[1px]'>
                            <Avatar className="rounded-full w-full h-full ">
                                <AvatarImage src={author.image} alt={author.username} className='object-cover' />
                                <AvatarFallback>{author.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                    </button>
                    <div className="flex w-full justify-between gap-5 pl-0.5">
                        <span className="flex items-center justify-center gap-1.5 cursor-pointer">
                            <Username author={author} />
                        </span>
                        <div className="justify-between items-center self-stretch flex gap-3">
                            <time className="text-right text-[15px] leading-none self-stretch  text-[#777777] cursor-default">
                                {formatTimeAgo(createdAt)}
                            </time>
                            <PostMenu id={author.id} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <div className="justify-center items-start self-stretch flex flex-col">
                        <div className="justify-center items-start flex w-full flex-col  pt-1.5 self-start">
                            <div className="text-white  leading-5 mt-1  text-[15px]">
                                {text}
                            </div>
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
                                    text,
                                    author: { ...author }
                                }} />
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit'>
                                    <Icons.repost className='w-5 h-5 ' />
                                </div>
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 '>
                                    <Icons.share className='w-5 h-5 ' />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* {likeUpdate.current.likeCount > 0 &&
                    <div className="flex items-start gap-2 text-[#777777] text-[15px] text-center mt-0.5 pb-4 z-50">
                        <p>0 replies</p>
                        <p>{likeUpdate.current.likeCount} likes</p>
                    </div>
                } */}
                    <Link href={`/@${author.username}/post/${id}`} className={cn('flex items-center gap-2 text-[#777777] text-[15px] text-center z-50 ', {
                        'mb-4': replies.length > 0 || likeUpdate.current.likeCount > 0
                    })}>
                        {replies.length > 0 && <p className='hover:underline mt-0.5'>
                            {replies.length} replies</p>
                        }
                        {replies.length > 0 && likeUpdate.current.likeCount > 0 && <p> · </p>}
                        {likeUpdate.current.likeCount > 0 &&
                            <p className='hover:underline mt-0.5' >{likeUpdate.current.likeCount} likes</p>
                        }
                    </Link>
                </div>
            </div >
        </>
    )
}

export default ReplyThreadCard


