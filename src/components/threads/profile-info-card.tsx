import React from 'react'
import Link from 'next/link'
import { formatURL, truncateText } from '@/lib/utils'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ThreadCardProps } from '@/types'

type ProfileInfoCardProps = ThreadCardProps['author']

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
    bio,
    image,
    username,
    followers,
    fullname,
    link
}) => {
    return (
        <div className="z-[10] flex  flex-col space-y-4 h-fit  rounded-2xl p-6 bg-background shadow-xl dark:bg-[#181818]">
            <Link href={`/@${username}`} className="flex w-full items-center ">
                <div className="flex w-full flex-col  gap-1 truncate ">
                    <h1 className="text-[25px] font-extrabold tracking-normal truncate ">
                        {fullname}
                    </h1>
                    <div className="flex gap-1">
                        <h4 className="text-[15px] truncate">
                            {username}
                        </h4>
                        <span className="ml-0.5 rounded-2xl bg-primary text-[#777777] text-xm px-1.5 py-1 text-[11px] font-medium">threads.net</span>
                    </div>
                </div>
                <Avatar className="h-[64px] w-[64px] overflow-visible outline outline-2 outline-border relative">
                    <AvatarImage src={image ?? ''} alt={fullname ?? ''} className="h-min w-full rounded-full object-cover " />
                    <AvatarFallback></AvatarFallback>
                    <div className='absolute bottom-0 -left-1'>
                        <Icons.verified2 className='h-5 w-5 text-background' />
                    </div>
                </Avatar>
            </Link>

            {bio &&
                <span dangerouslySetInnerHTML={{
                    __html: bio.slice(1, -1).replace(/\\n/g, '\n')
                }}
                    className='text-[15px] max-h-[100px] whitespace-pre-line text-overflow-ellipsis' />
            }
            <div className='flex  items-center'>
                <div className="flex -space-x-1 overflow-hidden items-center ">
                    {followers.map((follower, index) => (
                        <>
                            <img
                                // key={index}
                                className="inline-block h-4 w-4 rounded-full ring-2 ring-[#181818]"
                                src={image ?? ''}
                                alt="Follower"
                            />
                            <img
                                // key={index}
                                className="inline-block h-4 w-4 rounded-full ring-2 ring-[#181818]"
                                src={image ?? ''}
                                alt="Follower"
                            />
                        </>
                    ))}
                </div>
                <div className='flex gap-2'>

                    {followers.length > 0 &&
                        <>
                            <div className='pl-2 text-[#777777] text-[15px]'>{followers.length} {followers.length === 1 ? 'follower' : 'followers'}</div>
                            <p className='text-[#777777]'> · </p>
                        </>
                    }

                    {link &&
                        <>
                            <Link href={link} className='text-[#777777] text-[15px] hover:underline cursor-pointer active:text-[#4d4d4d]'>
                                {formatURL(link)}
                            </Link>

                        </>
                    }

                </div>
            </div>
            <Button className='w-full rounded-xl bg-foreground hover:bg-foreground select-none text-white dark:text-black'>
                Follow
            </Button>
        </div>

    )
}

export default ProfileInfoCard