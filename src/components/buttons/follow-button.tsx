import React from 'react'
import { Follow } from '@/components/ui/follow-button'
import { api } from '@/trpc/react';
import { toast } from 'sonner';

interface FollowButtonProps {
    id: string
    variant: string
}

const FollowButton: React.FC<FollowButtonProps> = ({ id, variant }) => {

    const followUpdate = React.useRef({
        isFollowedByMe: false,
    });

    const { mutate: toggleFollow, isLoading } = api.user.toggleFollow.useMutation({
        onMutate: async () => {

            const previousFollowedByMe = followUpdate.current.isFollowedByMe;

            followUpdate.current.isFollowedByMe = !followUpdate.current.isFollowedByMe;

            if (followUpdate.current.isFollowedByMe === true) {
                toast('Followed')
            } else {
                toast('UnFollowed')
            }

            return { previousFollowedByMe };

        },
        onError: (error, variables, context) => {

            followUpdate.current.isFollowedByMe = context?.previousFollowedByMe!;
            toast.error("FollowError: Something went wrong!")

        },
    });

    const setVariant = variant === 'default' ? 'default' : 'outline'
    return (
        <Follow
            disabled={isLoading}
            onClick={() => {
                toggleFollow({ id })
            }}
            variant={!followUpdate.current.isFollowedByMe ? setVariant : 'outline'}
            className='rounded-xl py-1.5 px-4 select-none'>
            {followUpdate.current.isFollowedByMe ? 'Following' : 'Follow'}
        </Follow>
    )
}

export default FollowButton