import React from 'react'
import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserCardProps } from '@/types'
import Link from 'next/link'

const UserCard: React.FC<UserCardProps> = ({ id, bio, fullname, createdAt, image, link, username }) => {

    return (
        <div className=' z-[10] flex flex-col w-full'>
            <div className='flex w-full mt-4'>
                <Avatar className="h-10 w-10 relative overflow-visible ">
                    <AvatarImage src={image} alt="Avatar" className='rounded-full object-cover' />
                    <AvatarFallback>OG</AvatarFallback>
                </Avatar>
                <div className='flex flex-col w-full  ml-3'>
                    <div className='flex justify-between  w-full'>
                        <Link href={`/@${username}`} className="flex flex-col gap-1.5 mt-1.5 w-full">
                            {/* <div className='flex gap-1 justify-center items-center'> */}
                            <p className="text-[15px] font-semibold  hover:underline leading-[0]">
                                {username}
                            </p>
                            {/* </div> */}
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