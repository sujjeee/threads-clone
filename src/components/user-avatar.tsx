import React from 'react'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar'
import Link from 'next/link'
import { NotificationType } from '@prisma/client'
import { Icons } from './icons'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  username: string
  image: string
  fullname: string
  type: NotificationType
}

const UserAvatar: React.FC<UserAvatarProps> = ({ username, image, fullname, type }) => {

  function enumToLower(enumValue: string): string {
    return enumValue.toLowerCase();
  }
  const icon_name = enumToLower(type) as keyof typeof Icons

  const Icon = Icons[icon_name]

  return (
    <Link href={`/@${username}`} >
      <Avatar className="h-10 w-10 relative overflow-visible cursor-pointer ">
        <AvatarImage src={image} alt={fullname} className="rounded-full w-full h-full object-cover" />
        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-2xl border-2 border-background text-white',
            {
              'bg-[#fe0169]': icon_name === 'like',
              'bg-[#6e3def]': icon_name === 'follow',
              'bg-[#24c3ff]': icon_name === 'reply',
            }
          )}
        >
          <Icon className='h-[18px] w-[18px] p-1' fill='white' />
        </div>
      </Avatar>
    </Link>
  )
}

export default UserAvatar