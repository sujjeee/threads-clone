import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserCardProps } from '@/types'
import Link from 'next/link'
import Username from '@/components/threads/username'
import { Icons } from './icons'

const UserCard: React.FC<UserCardProps> = ({
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
                            <span>12K followers</span>
                        </Link>
                        <Button variant={'outline'} size={'sm'} className='rounded-xl px-8'>Follow</Button>
                    </div>
                    <Separator className="mt-4" />
                </div>
            </div>
        </div>
    )
}

export default UserCard