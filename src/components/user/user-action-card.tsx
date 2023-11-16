import React from 'react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import type { UserCardProps } from '@/types'
import Username from '@/components/user/user-username'
import { Icons } from '@/components/icons'
import FollowButton from '@/components/buttons/follow-button'
import UserFollowers from '@/components/user/user-followers'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'

const UserActionCard: React.FC<UserCardProps> = ({
    id,
    bio,
    fullname,
    createdAt,
    image,
    link,
    isAdmin,
    username,
    followers
}) => {
    return (
        <div className='flex flex-col w-full'>
            <div className='flex w-full mt-5'>
                <Link href={`/@${username}`} >
                    <Avatar className="h-10 w-10 relative overflow-visible cursor-pointer outline outline-1 outline-border ">
                        <AvatarImage src={image ?? ''} alt={fullname ?? ''} className='rounded-full object-cover' />
                        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className='flex flex-col w-full ml-3'>
                    <div className='flex justify-between  w-full'>
                        <Link href={`/@${username}`} className="flex flex-col gap-1.5 w-full">
                            <div className='flex flex-col w-full'>
                                <div className='flex'>
                                    <Username
                                        author={{
                                            id,
                                            image,
                                            createdAt,
                                            username,
                                            fullname,
                                            isAdmin,
                                            link,
                                            bio,
                                            followers
                                        }}
                                    />
                                    {/* TODO: This is temp solution */}
                                    <div className='w-3 h-3 invisible'>
                                        <Icons.verified className='w-3 h-3' />
                                    </div>
                                </div>
                                <span className="text-[15px]  text-[#6A6A6A] tracking-wide mt-1">
                                    {fullname}
                                </span>
                            </div>
                        </Link>
                        <FollowButton
                            className='text-[14px] px-6'
                            variant='outline'
                            author={{
                                id,
                                image,
                                createdAt,
                                username,
                                fullname,
                                isAdmin,
                                link,
                                bio,
                                followers
                            }} />
                    </div>
                    <UserFollowers followers={followers} showImage={false} className='text-black dark:text-white pl-0 mt-1 text-[16px]' />
                    <Separator className="mt-4" />
                </div>
            </div>
        </div>
    )
}

export default UserActionCard