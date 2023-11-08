"use client"

import React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Icons } from '@/components/icons'
import { cn, formatTimeAgo } from '@/lib/utils'
import { api } from '@/trpc/react'
import { useUser } from '@clerk/nextjs'
import { ThreadCardProps } from '@/types'
import CreateThread from '@/components/threads/create-thread'
import RepliesImageContainer from '@/components/threads/replies-image-container'
import ProfileInfoCard from '@/components/threads/profile-info-card'
import PostMenu from '@/components/buttons/post-menu'
import ShareButton from '@/components/buttons/share-button'
import RepostButton from '@/components/buttons/repost-button'
import Username from '@/components/threads/username'
import PostActivity from '@/components/threads/post-activity'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

const ParentThreadCard: React.FC<ThreadCardProps> = ({
    id,
    text,
    createdAt,
    likes,
    replies,
    author,
    count,
    images
}) => {

    console.log('count', count)

    const { user: loggedUser } = useUser()

    // @ts-ignore
    const isLikedByMe = likes.includes(loggedUser?.id);

    const getThreadReplies = replies?.map((reply) => ({
        id: reply.author.id,
        username: reply.author.username,
        image: reply.author.image,
    }));

    const { likeCount, replyCount } = count

    const likeUpdate = React.useRef({
        isLikedByMe,
        likeCount
    });

    const { mutate: toggleLike, isLoading } = api.like.toggleLike.useMutation({
        onMutate: async () => {

            const previousLikedByMe = likeUpdate.current.isLikedByMe;
            const previousLikeCount = likeUpdate.current.likeCount;

            likeUpdate.current.isLikedByMe = !likeUpdate.current.isLikedByMe;
            likeUpdate.current.likeCount = likeUpdate.current.isLikedByMe ? likeUpdate.current.likeCount + 1 : likeUpdate.current.likeCount - 1;


            return { previousLikedByMe, previousLikeCount };

        },
        onError: (error, variables, context) => {

            likeUpdate.current.isLikedByMe = context?.previousLikedByMe!;
            likeUpdate.current.likeCount = context?.previousLikeCount!;

            toast.error("LikeCallBack: Something went wrong!")

        },
    });

    return (
        <>
            <div className='flex w-full gap-2'>
                <div className="flex flex-col items-center gap-1.5 ">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className='relative '>
                                <div className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full ml-[1px]'>
                                    <Avatar className="rounded-full w-full h-full ">
                                        <AvatarImage src={author.image ?? ""} alt={author.username} className='object-cover' />
                                        <AvatarFallback>{author.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='bg-foreground absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-background hover:scale-105 active:scale-95'>
                                    <Plus className='h-4 w-4 p-0.5' />
                                </div>
                            </button>
                        </DialogTrigger>
                        <DialogContent className='max-w-[360px] w-full p-0 rounded-2xl  border-none'>
                            <ProfileInfoCard {...author} />
                        </DialogContent>
                    </Dialog>

                    {replyCount > 0 &&
                        // TODO: need to fix this
                        <div className='relative h-full '>
                            <div className="h-full w-0.5 bg-[#313639] rounded-full  leading-[0]" />
                            <div className='h-full absolute -left-[14px] z-[50]  leading-[0] transform -translate-y-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="29" viewBox="0 0 17 29" fill="none">
                                    <path d="M16 27.5V15.5C16 10.7858 11.7871 5.70534 7.23886 5.70533C2.69067 5.70532 1.92432 8.83932 1.92432 10.6923C1.92432 12.5452 2.85983 15.4303 7.23957 15.4303C12.2931 15.4303 16 10.5535 16 5.5V1.5" stroke="#313639" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    }

                </div>

                <div className="flex flex-col w-full px-2">
                    <div className="justify-center items-start self-stretch flex flex-col max-md:max-w-full  ">
                        <div className="justify-center items-start flex w-full flex-col  pt-0 self-start">
                            <div className=" flex w-full justify-between gap-5 py-px self-start max-md:max-w-full max-md:flex-wrap ">
                                <Username author={author} />
                                <div className="justify-between items-center self-stretch flex gap-3">
                                    <time className="text-right text-[15px] leading-none self-stretch  text-[#777777] cursor-default">
                                        {formatTimeAgo(createdAt)}
                                    </time>
                                    <PostMenu id={author.id} />
                                </div>
                            </div>

                            <Link href={`/@${author.username}/post/${id}`} className='w-full '>
                                <div dangerouslySetInnerHTML={{ __html: text.slice(1, -1).replace(/\\n/g, '\n') }} className="text-white text-[15px] leading-5 mt-1 max-md:max-w-full whitespace-pre-line" />
                            </Link>

                            {images.length > 0 &&
                                <div className='relative overflow-hidden rounded-[12px] border border-[#393939] w-fit mt-2.5 '>
                                    <img src={images[0]} alt="" className='object-contain max-h-[520px] max-w-full  rounded-[12px]' />
                                </div>
                            }

                            <div className="flex  font-bold -ml-2 mt-2 w-full">
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit active:scale-95'>
                                    <button disabled={isLoading}>
                                        <Icons.heart
                                            onClick={() => {
                                                toggleLike({ id })
                                            }}
                                            fill={likeUpdate.current.isLikedByMe ? '#ff3040' : 'none'}
                                            className={cn('w-5 h-5 ', {
                                                "text-[#ff3040]": likeUpdate.current.isLikedByMe
                                            })} />
                                    </button>
                                </div>
                                <CreateThread
                                    showIcon={true}
                                    replyThreadInfo={{
                                        id,
                                        text,
                                        image: images.length > 0 ? images[0] : '',
                                        author: { ...author }
                                    }} />
                                <RepostButton id={id} />
                                <ShareButton
                                    id={id}
                                    author={author.username}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className={cn('flex items-center select-none pb-2', {
                " gap-2 pb-4 ": replyCount > 0 || likeUpdate.current.likeCount > 0
            })}>

                <div className={cn("flex invisible justify-center items-center w-[36px] ", {
                    "invisible": replyCount > 0
                })}>
                    <RepliesImageContainer author={getThreadReplies} />
                </div>

                <div className="flex items-center  text-[#777777] text-[15px] text-center px-2">

                    <Link
                        href={`/@${author.username}/post/${id}`}>
                        {replyCount > 0 && (
                            <p className='hover:underline '>
                                {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                            </p>
                        )}
                    </Link>

                    {replyCount > 0 && likeUpdate.current.likeCount > 0 && <p className='mx-2'> · </p>}

                    {/* {likeUpdate.current.likeCount > 0 && (
                        <p className='hover:underline'>
                            {likeUpdate.current.likeCount} {likeUpdate.current.likeCount === 1 ? 'like' : 'likes'}
                        </p>
                    )} */}
                    {likeUpdate.current.likeCount > 0 && (
                        <PostActivity
                            author={author}
                            id={id}
                            likeCount={likeUpdate.current.likeCount}
                            text={text}
                        />
                    )}
                </div>
            </div >
        </>
    )
}

export default ParentThreadCard