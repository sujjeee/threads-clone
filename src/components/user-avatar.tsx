import React from 'react'
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@/components/ui/avatar'
import Link from 'next/link'

interface UserAvatarProps {
    image: string | null | undefined
    username: string
    fullname: string | null | undefined
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    username,
    image,
    fullname,
}) => {
    return (
        <Link href={`/@${username}`} >
            <div className='outline outline-1 outline-[#333333] rounded-full ml-[1px]'>
                <Avatar className="h-9 w-9 outline outline-1 outline-[#333333] rounded-full  ">
                    <AvatarImage
                        src={image ?? ""}
                        alt={fullname ?? ""}
                        className="rounded-full w-full h-full object-cover" />
                    <AvatarFallback>
                        {username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        </Link>
    )
}

export default UserAvatar