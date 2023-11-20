"use client"

import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { cn, formatTimeAgo } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import type { PostCardProps } from '@/types'
import UserRepliesImages from '@/components/user/user-replies-images'
import ProfileInfoCard from '@/components/cards/user-profile-card'
import PostActionMenu from '@/components/menus/post-action-menu'
import ShareButton from '@/components/buttons/share-button'
import RepostButton from '@/components/buttons/repost-button'
import Username from '@/components/user/user-username'
import PostActivityCard from '@/components/cards/post-activity-card'
import { useTheme } from 'next-themes'
import LikeButton from '@/components/buttons/like-button'
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
import PostImageCard from '@/components/cards/post-image-card'
import PostQuoteCard from '@/components/cards/post-quote-card'
import ReplyButton from '@/components/buttons/reply-button'

const PostParentCard: React.FC<PostCardProps> = ({
    id,
    text,
    createdAt,
    likes,
    replies,
    author,
    count,
    images,
    reposts,
    quoteId
}) => {

    const { user: loggedUser } = useUser()

    const { replyCount } = count

    const isRepostedByMe = reposts?.some(repost => repost.userId === loggedUser?.id);

    const getThreadReplies = replies?.map((reply) => ({
        id: reply.author.id,
        username: reply.author.username,
        image: reply.author.image,
    }));

    const [likeCount, setLikeCount] = React.useState(count.likeCount)

    const handleLikeClick = (isLiked: boolean) => {
        if (!isLiked) {
            setLikeCount(likeCount + 1);
        } else {
            setLikeCount(likeCount - 1);
        }
    };

    const { theme } = useTheme()

    return (
        <>
            <div className='flex w-full gap-2'>
                <div className="flex flex-col items-center gap-1.5 ">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className='relative '>
                                <div className='h-9 w-9 outline outline-1 outline-border rounded-full ml-[1px]'>
                                    <Avatar className="rounded-full w-full h-full ">
                                        <AvatarImage
                                            src={author.image ?? ''}
                                            alt={author.username}
                                            className='object-cover' />
                                        <AvatarFallback>
                                            {author.username?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='bg-foreground absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-background hover:scale-105 active:scale-95'>
                                    <Plus className='h-4 w-4 p-0.5 text-white dark:text-black' />
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
                            <div className="h-full w-0.5 bg-[#D8D8D8] dark:bg-[#313639] rounded-full  leading-[0]" />
                            <div className='h-full absolute -left-[14px] z-[10]  leading-[0] transform -translate-y-1 text-[#D8D8D8] dark:text-[#313639]'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="29" viewBox="0 0 17 29" fill="none">
                                    <path d="M16 27.5V15.5C16 10.7858 11.7871 5.70534 7.23886 5.70533C2.69067 5.70532 1.92432 8.83932 1.92432 10.6923C1.92432 12.5452 2.85983 15.4303 7.23957 15.4303C12.2931 15.4303 16 10.5535 16 5.5V1.5" stroke={theme === 'light' ? '#D8D8D8' : '#313639'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
                                    <PostActionMenu authorId={author.id} threadId={id} />
                                </div>
                            </div>

                            <Link href={`/@${author.username}/post/${id}`} className='w-full '>
                                <div dangerouslySetInnerHTML={{ __html: text.slice(1, -1).replace(/\\n/g, '\n') }} className="text-accent-foreground text-[15px] leading-5 mt-1 max-md:max-w-full whitespace-pre-line" />
                            </Link>

                            {images && images.length > 0 &&
                                <PostImageCard image={images[0]} />
                            }

                            {quoteId &&
                                <PostQuoteCard quoteId={quoteId} createdAt={createdAt} />
                            }

                            <div className="flex  font-bold -ml-2 mt-2 w-full">
                                <LikeButton
                                    likeInfo={{
                                        id,
                                        count,
                                        likes
                                    }}
                                    onLike={handleLikeClick}
                                />
                                <ReplyButton
                                    replyThreadInfo={{
                                        id,
                                        text,
                                        images: images,
                                        author: { ...author }
                                    }} />
                                <RepostButton
                                    id={id}
                                    text={text}
                                    author={author}
                                    createdAt={createdAt}
                                    isRepostedByMe={isRepostedByMe}
                                />
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
                " gap-2 pb-3.5 ": replyCount > 0 || likeCount > 0
            })}>

                <div className={cn("flex invisible justify-center items-center w-[36px] ", {
                    "invisible": replyCount > 0
                })}>
                    <UserRepliesImages author={getThreadReplies} />
                </div>

                <div className="flex items-center  text-[#777777] text-[15px] text-center px-2">

                    <Link
                        href={`/@${author.username}/post/${id}`}>
                        {replyCount > 0 && (
                            <span className='hover:underline '>
                                {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                            </span>
                        )}
                    </Link>

                    {replyCount > 0 && likeCount > 0 && <span className='mx-2'> · </span>}

                    {likeCount > 0 && (
                        <PostActivityCard
                            author={author}
                            id={id}
                            likeCount={likeCount}
                            text={text}
                        />
                    )}
                </div>
            </div >
        </>
    )
}

export default PostParentCard