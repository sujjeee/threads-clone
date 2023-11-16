"use client"

import React from 'react'
import { Instagram } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { cn, formatURL } from '@/lib/utils'
import { Icons } from '@/components/icons'
import type { UserProfileInfoProps } from '@/types'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'
import UserFollowers from '@/components/user/user-followers'
import FollowButton from '@/components/buttons/follow-button'

const UserProfile: React.FC<UserProfileInfoProps> = (props) => {
    const {
        id,
        bio,
        fullname,
        image,
        link,
        username,
        followers,
        isAdmin
    } = props
    const path = usePathname()
    const { user } = useUser()

    const params = useParams()
    const profile = params.profile as string
    const usernamePath = decodeURIComponent(profile).substring(1)
    const basePath = `@${usernamePath}`

    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];

    return (
        <div className=" z-[10] mt-4 flex w-full flex-col space-y-4">
            <div className="flex w-fullitems-center">
                <div className="flex w-full flex-col p-3 pl-0 gap-1">
                    <h1 className="text-2xl font-bold tracking-normal">
                        {fullname}
                    </h1>
                    <div className="flex gap-1">
                        <h4 className="text-[15px]">
                            {username}
                        </h4>
                        <span className="ml-0.5 rounded-2xl bg-primary text-[#777777] text-xm px-1.5 py-1 text-[11px] font-medium">threads.net</span>
                    </div>
                </div>
                <Avatar className="h-[80px] w-[80px] overflow-visible outline outline-2 outline-border relative">
                    <AvatarImage src={image ?? ""} alt={fullname ?? ''} className="h-min w-full rounded-full object-cover " />
                    <AvatarFallback></AvatarFallback>
                    {isAdmin &&
                        <div className='absolute bottom-0 -left-0.5'>
                            <Icons.verified2 className='h-6 w-6 text-background' />
                        </div>
                    }
                </Avatar>
            </div>

            {bio &&
                <span dangerouslySetInnerHTML={{
                    __html: bio?.slice(1, -1).replace(/\\n/g, '\n')
                }} className='text-[15px] whitespace-pre-line' />
            }

            <div className='flex justify-between items-center'>
                <div className="hidden sm:flex -space-x-1 overflow-hidden w-full items-center ">
                    <div className='flex items-center'>
                        <UserFollowers followers={followers} showImage={true} />

                        {followers.length > 0 && link && <span className='mx-2 text-[#777777]'> · </span>}

                        {link &&
                            <Link href={link} className='text-[#777777] text-[15px] hover:underline cursor-pointer active:text-[#4d4d4d]'>
                                {formatURL(link)}
                            </Link>
                        }
                    </div>
                </div>
                <div className='flex gap-4'>
                    <Instagram className='h-6 w-6' />
                    {user?.id != id &&
                        <Icons.circleMenu className='h-6 w-6' />
                    }
                </div>
            </div>
            {user?.id != id &&
                <div className="grid gap-2 sm:grid-cols-2 pt-2">
                    <FollowButton
                        className="text-[14px] px-6"
                        variant='default'
                        author={props} />
                    <Button
                        size={'sm'}
                        variant="outline"
                        className="w-full border-[#333333] sm:w-auto rounded-xl cursor-not-allowed py-1 font-semibold tracking-normal text-[16px] active:scale-95 "
                    >
                        Mention
                    </Button>
                </div>
            }
            <div className="w-full flex border-b border-border">
                <Link
                    href={`/${basePath}`} className={cn("flex items-center justify-center w-full h-12  font-medium  duration-200  text-center text-neutral-600", {
                        "border-b-2 border-foreground text-foreground": lastSegment === basePath
                    })}>
                    Threads
                </Link>
                <Link
                    href={`/${basePath}/replies`}
                    className={cn('flex items-center justify-center w-full h-12  font-medium  duration-200 text-center text-neutral-600', {
                        "border-b-2 border-foreground text-foreground": lastSegment === 'replies'
                    })}
                >
                    Replies
                </Link>
                <Link
                    href={`/${basePath}/reposts`}
                    className={cn('flex items-center justify-center w-full h-12  font-medium  duration-200  text-center text-neutral-600', {
                        "border-b-2 border-foreground text-foreground": lastSegment === 'reposts'
                    })}
                >
                    Reposts
                </Link>
            </div>
        </div >
    )
}

export default UserProfile