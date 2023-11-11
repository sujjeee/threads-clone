"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import Username from '@/components/user/user-username'
import UserAvatar from '@/components/user/user-avatar'
import { api } from '@/trpc/react'
import { Icons } from '@/components/icons'
import { ParentPostInfo } from '@/types'

type PostPreviewCardProps = Partial<Pick<ParentPostInfo, 'id' | 'text' | 'author'>>;

const PostPreviewCard: React.FC<PostPreviewCardProps & { quoteId?: string }> = ({
    author,
    text,
    quoteId
}) => {
    if (quoteId) {
        const { data, isLoading } = api.post.getQuotedPost.useQuery(
            { id: quoteId },
            {
                enabled: !!quoteId,
                staleTime: Infinity,
            }
        );
        if (isLoading) {
            return (
                <div className="h-[100px] w-full justify-center items-center flex ">
                    <Icons.loading className='h-11 w-11' />
                </div>
            );
        }

        if (!data) return <>Not found.</>;

        return <RenderCard author={data?.postInfo.user} text={data?.postInfo.text} />;
    }

    // Use author and text directly without making an API call
    return <RenderCard author={author} text={text} />;

}

export default PostPreviewCard

const RenderCard: React.FC<PostPreviewCardProps> = ({
    author,
    text,
}) => {
    return (
        <Card className='overflow-hidden p-4 mt-3 rounded-lg space-y-1.5 bg-transparent border-border w-full'>
            <div className='flex items-center gap-2'>
                <UserAvatar
                    fullname={author?.fullname}
                    image={author?.image}
                    username={author?.username ?? ''}
                    className='h-7 w-7'
                />
                <Username author={author!} />
            </div>
            {text &&
                <p className='flex-grow resize-none overflow-hidden outline-none text-[15px] text-accent-foreground break-words placeholder:text-[#777777] w-full tracking-normal whitespace-pre-line truncate'>
                    <div dangerouslySetInnerHTML={{
                        __html: text.slice(1, -1).replace(/\\n/g, '\n')
                    }} />
                </p>
            }
        </Card>
    )
}

