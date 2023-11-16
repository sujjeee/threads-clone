"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { ChevronRight } from 'lucide-react'
import { api } from '@/trpc/react'
import type { AuthorInfoProps } from '@/types'
import Username from '@/components/user/user-username'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import FollowButton from '@/components/buttons/follow-button'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'

interface PostActivityCardProps {
    likeCount: number
    id: string
    text: string
    author: AuthorInfoProps
}

const PostActivityCard: React.FC<PostActivityCardProps> = ({ likeCount, id, text, author }) => {

    return (
        <Dialog>
            <DialogTrigger>
                <span className='hover:underline'>
                    {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                </span>
            </DialogTrigger>
            <DialogContent className='rounded-xl gap-0 p-0 border-none ring-1 ring-[#393939] bg-background shadow-2xl dark:bg-[#181818] max-w-[520px] w-full'>
                <div className='flex items-center  justify-between p-6'>
                    <div className="text-center w-full text-[15px] font-medium tracking-normal">Post activity</div>
                    <div className="text-right tracking-normal text-[15px]">Sort</div>
                </div>
                <section className='max-h-[80vh] overflow-y-auto no-scrollbar'>
                    <Card className='overflow-hidden p-4 mx-6 mb-2 rounded-xl space-y-1.5 bg-transparent border-border '>
                        <div className='flex items-center gap-2'>
                            <Avatar className="rounded-full w-7 h-7">
                                <AvatarImage src={author.image ?? ''} alt='author.username' />
                                <AvatarFallback>OG</AvatarFallback>
                            </Avatar>
                            <Username author={author} />
                        </div>
                        <div className='flex-grow resize-none overflow-hidden outline-none text-[15px] text-accent-foreground break-words placeholder:text-[#777777] w-full tracking-normal whitespace-pre-line truncate'>
                            <div dangerouslySetInnerHTML={{
                                __html: text.slice(1, -1).replace(/\\n/g, '\n')
                            }} />
                        </div>
                    </Card>
                    <DisplayInsight id={id} />
                </section>
            </DialogContent>
        </Dialog>
    )
}

export default PostActivityCard



interface DisplayInsightProps {
    id: string
}

const DisplayInsight: React.FC<DisplayInsightProps> = ({ id }) => {

    const { data, isLoading } = api.like.postLikeInfo.useQuery({ id })

    if (isLoading) {
        return (
            <div className="h-[100px] w-full justify-center items-center flex ">
                <Icons.loading className='h-11 w-11' />
            </div>
        )
    }

    const likeCount = data?.likes.length
    const repostCount = data?.reposts.length

    return (
        <>
            <div className='flex items-center w-full pl-1'>
                <div>
                    <Icons.heart className='h-6 w-6 mr-3 ml-6' />
                </div>
                <div className='flex justify-between items-center w-full border-b border-border py-5 mr-6'>
                    <span className='text-base font-semibold tracking-normal '>
                        Likes
                    </span>
                    <div className='flex gap-1 items-center'>
                        <span className='text-[15px]'>
                            {likeCount}
                        </span>
                        <ChevronRight className='h-5 w-5  ' />
                    </div>
                </div>
            </div>
            <div className='flex items-center w-full pl-1 '>
                <div>
                    <Icons.repost className='h-6 w-6 mr-3 ml-6' />
                </div>
                <div className='flex justify-between items-center w-full border-b border-border py-5 mr-6'>
                    <span className='text-base font-semibold tracking-normal '>
                        Reposts
                    </span>
                    <div className='flex gap-1 items-center'>
                        <span className='text-[15px]'>
                            {repostCount}
                        </span>
                        <ChevronRight className='h-5 w-5  ' />
                    </div>
                </div>
            </div>
            <div className='flex items-center w-full p-1 pr-0 '>
                <div>
                    <Icons.quote className='h-6 w-6 mr-3 ml-6' />
                </div>
                <div className='flex justify-between items-center w-full border-b border-border py-5 mr-6'>
                    <span className='text-base font-semibold tracking-normal '>
                        Quotes
                    </span>
                    <div className='flex gap-1 items-center'>
                        <span className='text-[15px]'>0</span>
                        <ChevronRight className='h-5 w-5  ' />
                    </div>
                </div>
            </div>

            {data?.likes.map((userData, index) => (
                <div key={index} className='flex items-center w-full '>
                    <button className='relative ml-4 mr-3'>
                        <div className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full'>
                            <Avatar className="rounded-full w-full h-full">
                                <AvatarImage
                                    src={userData.user.image ?? ''}
                                    alt={userData.user.fullname ?? ""} />
                                <AvatarFallback>
                                    {userData.user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='bg-red-500 absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-background hover:scale-105 active:scale-95'>
                            <Icons.heart className='h-4 w-4 p-[3px] text-white' fill='white' />
                        </div>
                    </button>
                    <div className={cn('flex justify-between items-center w-full py-5 mr-6 ', {
                        'border-b border-border': index !== data.likes.length - 1
                    })}>
                        <Link href={`/@${userData.user.username}`} className="flex flex-col gap-1.5 w-full">

                            <div className='flex flex-col w-full'>
                                <div className='flex'>
                                    <Username
                                        author={userData.user}
                                    />
                                    {/* TODO: This is temp solution */}
                                    <div className='w-3 h-3 invisible'>
                                        <Icons.verified className='w-3 h-3' />
                                    </div>
                                </div>
                                <span className="text-[15px]  text-[#6A6A6A] tracking-wide mt-1">
                                    {userData.user.fullname}
                                </span>
                            </div>
                        </Link>
                        <FollowButton variant='outline' author={userData.user} className='text-[14px] px-6' />
                    </div>
                </div>
            ))}

        </>
    )
}

