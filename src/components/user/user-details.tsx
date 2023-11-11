"use client"

import React from 'react'
import { Instagram } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { formatURL } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { UserProfileInfoProps } from '@/types'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'

const UserProfile: React.FC<UserProfileInfoProps> = ({
    id,
    bio,
    createdAt,
    fullname,
    image,
    link,
    privacy,
    username
}) => {
    const path = usePathname()
    const router = useRouter()
    const { user } = useUser()

    if (!path.startsWith('/@')) {
        const newPath = '/@' + path.replace(/^\//, '')
        router.push(newPath);
        return null;
    }

    return (
        <div className=" z-[10] mt-4 flex w-full flex-col space-y-4">
            <div className="flex w-fullitems-center">
                <div className="flex w-full flex-col p-3 pl-0 gap-1">
                    <h1 className="text-2xl font-bold tracking-normal">{fullname}</h1>
                    <div className="flex gap-1">
                        <h4 className="text-[15px]">{username}</h4>
                        <span className="ml-0.5 rounded-2xl bg-[#1E1E1E] text-[#777777] text-xm px-1.5 py-1 text-[11px] font-medium">threads.net</span>
                    </div>
                </div>
                <Avatar className="h-[80px] w-[80px] overflow-visible outline outline-2 outline-border relative">
                    <AvatarImage src={image ?? ""} alt={fullname ?? ''} className="h-min w-full rounded-full object-cover " />
                    <AvatarFallback></AvatarFallback>
                    <div className='absolute bottom-0 -left-0.5'>
                        <Icons.verified2 className='h-6 w-6 text-background' />
                    </div>
                </Avatar>
            </div>

            {bio &&
                <p dangerouslySetInnerHTML={{
                    __html: bio?.slice(1, -1).replace(/\\n/g, '\n')
                }} className='text-[15px] whitespace-pre-line' />
            }

            <div className='flex justify-between items-center'>
                <div className="hidden sm:flex -space-x-1 overflow-hidden w-full items-center ">
                    <img className="inline-block h-4 w-4 rounded-full ring-2 ring-background " src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" />
                    <img className="inline-block h-4 w-4 rounded-full ring-2 ring-background" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" />
                    <div className='flex gap-2'>
                        <div className='pl-4 text-[#777777] text-[15px]'>8 followers</div>
                        {link &&
                            <>
                                <p className='text-[#777777]'> · </p>
                                <Link href={link} className='text-[#777777] text-[15px] hover:underline cursor-pointer active:text-[#4d4d4d]'>
                                    {formatURL(link)}
                                </Link>
                            </>
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
                    <Button
                        size={'sm'}
                        className="w-full border-[#333333] sm:w-auto rounded-xl  py-1 "
                    >
                        Follow
                    </Button>
                    <Button
                        size={'sm'}
                        variant="outline"
                        className="w-full border-[#333333] sm:w-auto rounded-xl cursor-not-allowed py-1"
                    >
                        Mention
                    </Button>
                </div>
            }
            <div className="w-full  flex">
                <button className="w-full h-12 py-2 font-semibold border-b border-b-white text-center">
                    Threads
                </button>
                <Link
                    href={`${path}/replies`}
                    className="flex items-center justify-center w-full h-12  font-medium  duration-200 hover:border-neutral-700 hover:text-neutral-500 text-center text-neutral-600"
                >
                    Replies
                </Link>
                <Link
                    href={`${path}/repost`}
                    className="flex items-center justify-center w-full h-12 py-2 font-medium  duration-200 hover:border-neutral-700 hover:text-neutral-500 text-center text-neutral-600"
                >
                    Reposts
                </Link>
            </div>
        </div>
    )
}

export default UserProfile