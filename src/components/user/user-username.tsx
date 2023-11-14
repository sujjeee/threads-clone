import React from 'react'
import Link from 'next/link'
import type { AuthorInfoProps } from '@/types'
import { Icons } from '@/components/icons'
import UserProfileCard from '@/components/cards/user-profile-card'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

interface UserUsernameProps {
    author: AuthorInfoProps
}

const UserUsername: React.FC<UserUsernameProps> = ({ author }) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Link
                    href={`/@${author.username}`}
                    className="flex items-center justify-center gap-1.5 cursor-pointer hover:underline w-fit">
                    <h1 className="text-accent-foreground text-[15px] font-semibold leading-[0]">
                        {author.username}
                    </h1>
                    {author.isAdmin
                        && <Icons.verified className='w-3 h-3' />
                    }
                </Link>
            </HoverCardTrigger>
            <HoverCardContent
                align={"start"}
                sideOffset={10}
                className="w-[360px] p-0 z-[99999] rounded-2xl bg-transparent border-none">
                <UserProfileCard {...author} />
            </HoverCardContent>
        </HoverCard>
    )
}

export default UserUsername