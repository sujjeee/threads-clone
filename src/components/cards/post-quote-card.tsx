"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import Username from '@/components/user/user-username'
import UserAvatar from '@/components/user/user-avatar'
import { api } from '@/trpc/react'
import { Icons } from '@/components/icons'
import type { ParentPostInfo } from '@/types'
import Link from 'next/link'
import { formatTimeAgo } from '@/lib/utils'

type PostQuoteCardProps = Partial<Pick<ParentPostInfo, 'id' | 'text' | 'author'>> & { createdAt?: Date };

const PostQuoteCard: React.FC<PostQuoteCardProps & { quoteId?: string }> = ({
    author,
    text,
    quoteId,
    createdAt,
}) => {
    if (quoteId) {
        const { data, isLoading } = api.post.getQuotedPost.useQuery(
            { id: quoteId }, {
            enabled: !!quoteId,
            staleTime: Infinity,
        },
        );
        if (isLoading) {
            return (
                <div className="h-[100px] w-full justify-center items-center flex ">
                    <Icons.loading className='h-11 w-11' />
                </div>
            );
        }

        if (!data) return <>Not found.</>;

        return (
            <Link href={`/@${data.postInfo.user.username}/post/${data.postInfo.id}`} className='w-full'>
                <RenderCard author={data?.postInfo.user} text={data?.postInfo.text} createdAt={data.postInfo.createdAt} />
            </Link>
        );
    }
    return <RenderCard author={author} text={text} createdAt={createdAt} />;

}

export default PostQuoteCard

const RenderCard: React.FC<PostQuoteCardProps> = ({
    author,
    text,
    createdAt
}) => {
    return (
        <Card className='overflow-hidden p-4 mt-3 rounded-xl bg-transparent border-border w-full'>
            <div className='flex items-center justify-between mb-1.5 '>
                <div className="flex items-center gap-2">
                    <UserAvatar
                        fullname={author?.fullname}
                        image={author?.image}
                        username={author?.username ?? ''}
                        className='h-7 w-7'
                    />
                    <Username author={author!} />
                </div>
                <time className="text-[15px] text-[#777777] cursor-default">
                    {createdAt && formatTimeAgo(createdAt)}
                </time>
            </div>
            {text &&
                <span className='flex-grow resize-none overflow-hidden outline-none text-[15px] text-accent-foreground break-words placeholder:text-[#777777] w-full tracking-normal whitespace-pre-line truncate'>
                    <div dangerouslySetInnerHTML={{
                        __html: text.slice(1, -1).replace(/\\n/g, '\n')
                    }} />
                </span>
            }
        </Card>
    )
}
