"use client"

import React from 'react'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import type { PostCardProps } from '@/types'
import { api } from '@/trpc/react'
import { toast } from 'sonner'

interface LikeButtonProps {
    likeInfo: Pick<PostCardProps, 'id' | 'likes' | 'count'>
    onLike: (isLiked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ likeInfo, onLike }) => {
    const { user: loggedUser } = useUser()

    const { count, id, likes } = likeInfo
    const isLikedByMe = likes?.some((like) => like.userId === loggedUser?.id)

    const likeUpdate = React.useRef({
        isLikedByMe,
        likeCount: count.likeCount
    });

    const { mutate: toggleLike, isLoading } = api.like.toggleLike.useMutation({
        onMutate: () => {

            const previousLikedByMe = likeUpdate.current.isLikedByMe;
            const previousLikeCount = likeUpdate.current.likeCount;

            likeUpdate.current.isLikedByMe = !likeUpdate.current.isLikedByMe;
            likeUpdate.current.likeCount = likeUpdate.current.isLikedByMe ? likeUpdate.current.likeCount + 1 : likeUpdate.current.likeCount - 1;


            return { previousLikedByMe, previousLikeCount };

        },
        onError: (error, variables, context) => {
            likeUpdate.current.isLikedByMe = context?.previousLikedByMe ?? likeUpdate.current.isLikedByMe;
            likeUpdate.current.likeCount = context?.previousLikeCount ?? likeUpdate.current.likeCount;

            toast.error("Something went wrong!");
        },
    });

    return (
        <div className='flex items-center justify-center hover:bg-primary rounded-full p-2 w-fit h-fit active:scale-95'>
            <button disabled={isLoading}>
                <Icons.heart
                    onClick={() => {
                        onLike(likeUpdate.current.isLikedByMe);
                        toggleLike({ id })
                    }}
                    fill={likeUpdate.current.isLikedByMe ? '#ff3040' : 'transparent'}
                    className={cn('w-5 h-5 ', {
                        "text-[#ff3040]": likeUpdate.current.isLikedByMe
                    })} />
            </button>
        </div>
    )
}

export default LikeButton