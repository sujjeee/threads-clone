"use client"

import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import type { PostReplyCardProps } from '@/types'
import Username from '@/components/user/user-username'
import PostActionMenu from '@/components/menus/post-action-menu'
import PostParentCard from '@/components/cards/post-parent-card'
import ProfileInfoCard from '@/components/cards/user-profile-card'
import RepostButton from '@/components/buttons/repost-button'
import ShareButton from '@/components/buttons/share-button'
import LikeButton from '@/components/buttons/like-button'
import PostActivityCard from '@/components/cards/post-activity-card'
import {
    cn,
    formatTimeAgo
} from '@/lib/utils'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from '@/components/ui/dialog'
import PostImageCard from '@/components/cards/post-image-card'
import PostQuoteCard from '@/components/cards/post-quote-card'
import ReplyButton from '@/components/buttons/reply-button'

const PostReplyCard: React.FC<PostReplyCardProps> = ({ postInfo, parentPosts }) => {

    React.useEffect(() => {
        const scrollToPost = () => {
            const postIdFromUrl = postInfo.id;
            if (postIdFromUrl) {
                const postElement = document.getElementById(postIdFromUrl);
                if (postElement) {
                    postElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            }
        };

        scrollToPost();

    }, [postInfo]);


    const { user: loggedUser } = useUser()

    const {
        id,
        likes,
        replies,
        author,
        count,
        createdAt,
        text,
        images,
        reposts,
        quoteId
    } = postInfo

    const { replyCount } = count

    const isRepostedByMe = reposts?.some(repost => repost.userId === loggedUser?.id);

    const [likeCount, setLikeCount] = React.useState(count.likeCount)

    const handleLikeClick = (isLiked: boolean) => {
        if (!isLiked) {
            setLikeCount(likeCount + 1);
        } else {
            setLikeCount(likeCount - 1);
        }
    };
    return (
        <>
            <div className={cn('flex flex-col w-full pt-2 mb-8', {
                "mb-0": replies.length > 0
            })}>

                {parentPosts?.map((post, index) => (
                    <>
                        <PostParentCard
                            key={index}
                            author={post.author}
                            count={post.count}
                            id={post.id}
                            createdAt={post.createdAt}
                            likes={post.likes}
                            parentPostId={post.parentPostId}
                            replies={post.replies}
                            images={post.images}
                            text={post.text}
                            quoteId={post.quoteId}
                            reposts={post.reposts}
                        />
                    </>
                ))}

                <div className="flex items-center gap-3 w-full pr-2 ">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className='relative '>
                                <div className='h-9 w-9 outline outline-1 outline-border rounded-full ml-[1px]'>
                                    <Avatar className="rounded-full w-full h-full ">
                                        <AvatarImage src={author.image ?? ''} alt={author.username} className='object-cover' />
                                        <AvatarFallback>{author.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
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

                    <div className="flex w-full justify-between gap-5 pl-0.5 ">
                        <span className="flex items-center justify-center gap-1.5 cursor-pointer ">
                            <Username author={author} />
                        </span>
                        <div className="justify-between items-center self-stretch flex gap-3">
                            <time className="text-right text-[15px] leading-none self-stretch  text-[#777777] cursor-default">
                                {formatTimeAgo(createdAt)}
                            </time>
                            <PostActionMenu authorId={author.id} threadId={id} />
                        </div>
                    </div>

                </div>

                <div id={id} className="flex flex-col w-full">
                    <div className="justify-center items-start self-stretch flex flex-col">
                        <div className="justify-center items-start flex w-full flex-col  pt-1.5 self-start">

                            <div dangerouslySetInnerHTML={{
                                __html: text.slice(1, -1).replace(/\\n/g, '\n')
                            }}
                                className="text-accent-foreground text-[15px] leading-5 mt-1 max-md:max-w-full whitespace-pre-line"
                            />

                            {images && images.length > 0 &&
                                <PostImageCard image={images[0]} />
                            }

                            {quoteId &&
                                <PostQuoteCard quoteId={quoteId} createdAt={createdAt} />
                            }

                            <div className="flex  font-bold -ml-2 mt-2 w-full ">

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

                    <div className="flex items-center  text-[#777777] text-[15px] text-center pb-3">

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
                </div>
            </div >
        </>
    )
}

export default PostReplyCard

