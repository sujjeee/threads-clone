"use client"

import React from 'react'
import { Follow } from '@/components/ui/follow-button'
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import type { AuthorInfoProps } from '@/types';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';


interface FollowButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant: string;
    author: AuthorInfoProps;
}

const FollowButton: React.FC<FollowButtonProps> = ({ variant, author, className }) => {

    const path = usePathname()

    const { user: loggedUser } = useUser()

    const isSameUser = author.id === loggedUser?.id
    const isFollowedByMe = author.followers?.some((user) => user.id === loggedUser?.id)

    const followUpdate = React.useRef({
        isFollowedByMe,
    });

    const trpcUtils = api.useUtils();

    const { mutate: toggleFollow, isLoading } = api.user.toggleFollow.useMutation({
        onMutate: () => {

            const previousFollowedByMe = followUpdate.current.isFollowedByMe;

            followUpdate.current.isFollowedByMe = !followUpdate.current.isFollowedByMe;

            if (followUpdate.current.isFollowedByMe === true) {
                toast('Followed')
            } else {
                toast('Unfollowed')
            }

            return { previousFollowedByMe };

        },
        onError: (error, variables, context) => {
            followUpdate.current.isFollowedByMe = context?.previousFollowedByMe ?? followUpdate.current.isFollowedByMe;
            toast.error("FollowError: Something went wrong!");
        },
        onSettled: async () => {
            if (path === '/') {
                await trpcUtils.post.getInfinitePost.invalidate()
            }
            await trpcUtils.invalidate()
        },
    });

    const setVariant = variant === 'default' ? 'default' : 'outline'
    return (
        <Follow
            disabled={isLoading || isSameUser}
            onClick={() => {
                toggleFollow({ id: author.id })
            }}
            variant={!followUpdate.current.isFollowedByMe ? setVariant : 'outline'}
            className={cn("rounded-xl py-1.5 px-4 select-none", className, {
                "opacity-80": followUpdate.current.isFollowedByMe
            })}>
            {followUpdate.current.isFollowedByMe ? 'Following' : 'Follow'}
        </Follow>
    )
}

export default FollowButton