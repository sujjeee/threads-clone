import React from 'react'
import Link from 'next/link'
import type { NotificationType } from '@prisma/client'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar'

interface UserNotificationAvtarProps {
  username: string
  image: string
  fullname: string
  type: NotificationType
}

const UserNotificationAvtar: React.FC<UserNotificationAvtarProps> = ({
  username,
  image,
  fullname,
  type
}) => {

  function enumToLower(enumValue: string): string {
    return enumValue.toLowerCase();
  }

  const icon_name = enumToLower(type) as keyof typeof Icons

  const Icon = Icons[icon_name]

  return (
    <Link href={`/@${username}`} >
      <div className='outline outline-1 outline-border rounded-full ml-[1px]'>
        <Avatar className="h-10 w-10 relative overflow-visible cursor-pointer ">
          <AvatarImage
            src={image}
            alt={fullname}
            className="rounded-full w-full h-full object-cover" />
          <AvatarFallback>
            {username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
          <div
            className={cn(
              'absolute -bottom-1 -right-1 rounded-2xl border-2 border-background text-white', {
              'bg-[#fe0169]': icon_name === 'like',
              'bg-[#6e3def]': icon_name === 'follow',
              'bg-[#24c3ff]': icon_name === 'reply',
              'bg-[#c329bf]': icon_name === 'repost',
              'bg-[#fe7900]': icon_name === 'quote',
            })}
          >
            {type !== 'ADMIN' && <Icon className='h-[20px] w-[20px] p-1' fill='white' />}
          </div>
        </Avatar>
      </div>
    </Link>
  )
}

export default UserNotificationAvtar