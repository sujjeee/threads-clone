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

  const getIcon = (typeName: string) => {
    switch (typeName) {
      case 'QUOTE':
        return Icons.quote2;
      case 'REPLY':
        return Icons.reply2;
      case 'REPOST':
        return Icons.repost2;
      default:
        return Icons[enumToLower(typeName) as keyof typeof Icons];
    }
  };

  const IconComponent = getIcon(type);

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
              'bg-[#fe0169]': type === 'LIKE',
              'bg-[#6e3def]': type === 'FOLLOW',
              'bg-[#24c3ff]': type === 'REPLY',
              'bg-[#c329bf]': type === 'REPOST',
              'bg-[#fe7900]': type === 'QUOTE',
            })}
          >
            {type !== 'ADMIN' && IconComponent && (
              <IconComponent className='h-[20px] w-[20px]' fill='white' />
            )}
          </div>
        </Avatar>
      </div>
    </Link>
  )
}

export default UserNotificationAvtar