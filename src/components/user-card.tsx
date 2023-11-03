import React from 'react'
import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserCardProps } from '@/types'
import Link from 'next/link'
import Username from '@/components/threads/username'

const UserCard: React.FC<UserCardProps> = ({ id, bio, fullname, createdAt, image, link, username, followers }) => {
    return (
        <div className=' z-[10] flex flex-col w-full'>
            <div className='flex w-full mt-4'>
                <Avatar className="h-10 w-10 relative overflow-visible ">
                    <AvatarImage src={image} alt={fullname} className='rounded-full object-cover' />
                    <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col w-full  ml-3'>
                    <div className='flex justify-between  w-full'>
                        <Link href={`/@${username}`} className="flex flex-col gap-1.5 w-full">
                            <Username
                                author={{
                                    id,
                                    image,
                                    createdAt,
                                    username,
                                    fullname,
                                    link,
                                    bio,
                                    followers
                                }}
                            />
                            <p className="text-[15px]  text-[#6A6A6A] tracking-wide mt-1.5">
                                {fullname}
                            </p>
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