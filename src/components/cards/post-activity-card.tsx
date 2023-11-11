"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { AuthorInfoProps } from '@/types'
import Username from '@/components/user/user-username'
import Link from 'next/link'
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
            <DialogContent className='rounded-xl gap-0 p-0 bg-[#181818] border-[#393939] max-w-[520px] w-full'>
                <div className='flex items-center  justify-between p-6'>
                    <div className="text-center w-full text-[15px] font-medium tracking-normal">Post activity</div>
                    <div className="text-right tracking-normal text-[15px]">Sort</div>
                </div>
                <section className='max-h-[80vh] overflow-y-auto no-scrollbar'>
                    <Card className='overflow-hidden p-4 mx-6 mb-2 rounded-lg space-y-1.5 bg-transparent border-[#393939]'>
                        <div className='flex items-center gap-2'>
                            <Avatar className="rounded-full w-7 h-7">
                                <AvatarImage src={author.image ?? ''} alt='author.username' />
                                <AvatarFallback>OG</AvatarFallback>
                            </Avatar>
                            <Username author={author} />
                        </div>
                        <span className='truncate'>
                            {text}
                        </span>
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

    const { data, isLoading } = api.like.likeInfo.useQuery({ id })

    if (isLoading) {
        return (
            <div className="h-[100px] w-full justify-center items-center flex ">
                <Icons.loading className='h-11 w-11' />
            </div>
        )
    }

    return (
        <>
            {data?.map((post) => (
                <>
                    <div className='flex items-center w-full pl-1'>
                        <div>
                            <Icons.heart className='h-6 w-6 mr-3 ml-6' />
                        </div>
                        <div className='flex justify-between items-center w-full border-b border-[#393939] py-5 mr-6'>
                            <span className='text-base font-semibold tracking-normal '>Likes</span>
                            <div className='flex gap-1 items-center'>
                                <span className='text-[15px]'>
                                    {post.thread._count.likes}
                                </span>
                                <ChevronRight className='h-5 w-5  ' />
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center w-full pl-1 '>
                        <div>
                            <Icons.repost className='h-6 w-6 mr-3 ml-6' />
                        </div>
                        <div className='flex justify-between items-center w-full border-b border-[#393939] py-5 mr-6'>
                            <span className='text-base font-semibold tracking-normal '>Replies</span>
                            <div className='flex gap-1 items-center'>
                                <span className='text-[15px]'>
                                    {post.thread._count.replies}
                                </span>
                                <ChevronRight className='h-5 w-5  ' />
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center w-full p-1 pr-0 '>
                        <div>
                            <Icons.quote className='h-6 w-6 mr-3 ml-6' />
                        </div>
                        <div className='flex justify-between items-center w-full border-b border-[#393939] py-5 mr-6'>
                            <span className='text-base font-semibold tracking-normal '>Quotes</span>
                            <div className='flex gap-1 items-center'>
                                <span className='text-[15px]'>0</span>
                                <ChevronRight className='h-5 w-5  ' />
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center w-full '>
                        <button className='relative ml-4 mr-3'>
                            <div className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full'>
                                <Avatar className="rounded-full w-full h-full">
                                    <AvatarImage src={post.user.image ?? ''} alt={post.user.fullname ?? ""} />
                                    <AvatarFallback>{post.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className='bg-red-500 absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-background hover:scale-105 active:scale-95'>
                                <Icons.heart className='h-4 w-4 p-[3px] text-white' />
                            </div>
                        </button>
                        <div className='flex justify-between items-center w-full border-b border-[#393939] py-5 mr-6 '>
                            <Link href={`/@${post.user.username}`} className="flex flex-col gap-1.5 w-full">
                                <div className='flex flex-col w-full'>
                                    <Username
                                        author={post.user}
                                    />
                                    <p className="text-[15px]  text-[#6A6A6A] tracking-wide mt-1">
                                        {post.user.fullname}
                                    </p>
                                </div>
                            </Link>
                            <Button
                                className='px-6  rounded-xl focus:bg-transparent hover:bg-transparent'
                                variant={'outline'}>
                                Follow
                            </Button>
                        </div>
                    </div>
                </>
            ))}
        </>
    )
}
