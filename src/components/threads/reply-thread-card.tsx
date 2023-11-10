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
import ParentThreadCard from '@/components/threads/parent-thread-card'
import { Plus } from 'lucide-react'

const ReplyThreadCard: React.FC<ThreadProps> = ({ threadInfo, parentThreads }) => {
    React.useEffect(() => {
        const scrollToPost = async () => {
            const postIdFromUrl = threadInfo.id;
            if (postIdFromUrl) {
                const postElement = document.getElementById(postIdFromUrl);
                console.log('postElement?', postElement);
                if (postElement) {
                    postElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            }
        };

        scrollToPost();

    }, [threadInfo]);


    const { user: loginUser } = useUser()

    const {
        id,
        likes,
        replies,
        author,
        count,
        createdAt,
        text,
        images
    } = threadInfo

    const likeUpdate = React.useRef({
        likedByMe: loginUser && likes.some((like: any) => like.userId === loginUser.id),
        likeCount: count.likeCount
    });


    const { mutate: toggleLike } = api.like.toggleLike.useMutation({

        onMutate: () => {

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
            <div className={cn('flex flex-col w-full pt-2 mb-8', {
                "mb-0": replies.length > 0
            })}>

                {parentThreads && parentThreads.map((post, index) => (
                    <>
                        <ParentThreadCard
                            key={index}
                            author={post.author}
                            count={post.count}
                            id={post.id}
                            createdAt={post.createdAt}
                            likes={post.likes}
                            parentThreadId={post.parentThreadId}
                            replies={post.replies}
                            images={post.images}
                            text={post.text}
                            quoteId={post.quoteId}
                            reposts={post.reposts}
                        />
                    </>
                ))}

                <div className="flex items-center gap-3 w-full pr-2 ">

                    <button className='relative  '>
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

                    <div className="flex w-full justify-between gap-5 pl-0.5 ">
                        <span className="flex items-center justify-center gap-1.5 cursor-pointer ">
                            <Username author={author} />
                        </span>
                        <div className="justify-between items-center self-stretch flex gap-3">
                            <time className="text-right text-[15px] leading-none self-stretch  text-[#777777] cursor-default">
                                {formatTimeAgo(createdAt)}
                            </time>
                            <PostMenu id={author.id} threadId={id} />
                        </div>
                    </div>

                </div>

                <div id={id} className="flex flex-col w-full">
                    <div className="justify-center items-start self-stretch flex flex-col">
                        <div className="justify-center items-start flex w-full flex-col  pt-1.5 self-start">

                            <div dangerouslySetInnerHTML={{
                                __html: text.slice(1, -1).replace(/\\n/g, '\n')
                            }}
                                className="text-white text-[15px] leading-5 mt-1 max-md:max-w-full whitespace-pre-line"
                            />

                            {images.length > 0 &&
                                <div className='relative overflow-hidden rounded-[12px] border border-[#393939] w-fit mt-2.5 '>
                                    <img src={images[0]} alt="" className='object-contain max-h-[520px] max-w-full  rounded-[12px]' />
                                </div>
                            }

                            <div className="flex  font-bold -ml-2 mt-2 w-full ">

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

                                <CreateThread
                                    variant='reply'
                                    replyThreadInfo={{
                                        id,
                                        text,
                                        images: images,
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
                    {/* <div ref={scrollDownRef} /> */}

                    <Link href={`/@${author.username}/post/${id}`} className={cn('flex items-center gap-2 text-[#777777] text-[15px] text-center ', {
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

