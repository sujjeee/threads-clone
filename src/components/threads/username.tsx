import React from 'react'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { AuthorInfoProps } from '@/types'
import Link from 'next/link'
import { Icons } from '../icons'
import ProfileInfoCard from './profile-info-card'

interface UsernameProps {
    author: AuthorInfoProps
}

const Username: React.FC<UsernameProps> = ({ author }) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Link href={`/@${author.username}`} className="flex items-center justify-center gap-1.5 cursor-pointer hover:underline w-fit">
                    <h1 className="text-white text-[15px] font-semibold leading-[0]">
                        {author.username}
                    </h1>
                    <Icons.verified className='w-3 h-3' />
                </Link>
            </HoverCardTrigger>
            <HoverCardContent align={"start"} sideOffset={10} className="w-[360px] p-0 rounded-2xl bg-transparent border-none">
                <ProfileInfoCard {...author} />
            </HoverCardContent>
        </HoverCard>
    )
}

export default Username