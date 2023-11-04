"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { api } from '@/trpc/react'
import { useUser } from '@clerk/nextjs'
import { Heart, User2 } from 'lucide-react'
import React from 'react'
import Loading from '../loading'
import { redirect } from 'next/navigation'
import Username from '@/components/threads/username'
import { formatTimeAgo, truncateText } from '@/lib/utils'

export default function ActivityPage() {
    const { user: loggedUser } = useUser()
    const { data, isLoading } = api.post.notifications.useQuery({ id: loggedUser?.id! })

    if (isLoading) return <Loading />

    return (
        <>
            {data?.map((activity) => (
                <>
                    <div className='flex w-full mt-4 '>
                        <Avatar className="h-10 w-10 relative overflow-visible">
                            <AvatarImage src={activity.user.image} alt={activity.user.fullname} className="rounded-full w-full h-full" />
                            <AvatarFallback>OM</AvatarFallback>
                            <div className='bg-red-700 absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-white'>
                                <Heart className='h-[18px] w-[18px] p-1' fill='white' />
                            </div>
                        </Avatar>
                        <div className='flex flex-col w-full  ml-3'>
                            <div className='flex justify-between items-center w-full'>
                                <div className="flex flex-col gap-1.5 ">
                                    <div className='flex gap-1 items-center'>
                                        <p className="text-sm font-medium leading-none hover:underline">
                                            <Username author={activity.user} />
                                        </p>
                                        <time className='text-muted-foreground ml-3 leading-none text-[15px]'>
                                            {formatTimeAgo(activity.createdAt)}
                                        </time>
                                    </div>
                                    <p className="text-[15px] text-[#6A6A6A] tracking-wide leading-5">
                                        {truncateText(activity.message, 100)}
                                    </p>
                                </div>
                                {activity.type === "FOLLOW"
                                    && <Button variant={'outline'} size={'sm'} className='rounded-xl px-8'>Follow</Button>
                                }

                            </div>
                            <Separator className="mt-4" />
                        </div>
                    </div>
                </>
            ))}

        </>
    )
}

// {/* <div className='container max-w-[620px] z-[10] px-6 flex w-full mt-6 '>
//                         <Avatar className="h-10 w-10 relative overflow-visible">
//                             <AvatarImage src={post.user.image} alt={post.user.fullname} />
//                             <AvatarFallback>OM</AvatarFallback>
//                             <div className='bg-[#6E3DEF] absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-white'>
//                                 <User2 className='h-[18px] w-[18px] p-1' fill={'white'} />
//                             </div>
//                         </Avatar>
//                         <div className='flex flex-col w-full  ml-3'>
//                             <div className='flex justify-between items-center w-full'>
//                                 <div className="flex flex-col gap-2 mt-1.5">
//                                     <div className='flex gap-1 justify-center items-center'>
//                                         {/* <p className="text-sm font-medium leading-none hover:underline"></p> */}
//                                         <Username author={post.user} />
//                                         <time className='text-muted-foreground ml-3 leading-none'>
//                                             {formatTimeAgo(post.createdAt)}
//                                         </time>
//                                     </div>
//                                     <p className="text-[14px] text-[#6A6A6A] tracking-wide leading-5">
//                                         {truncateText(post.message, 115)}
//                                     </p>
//                                 </div>
//                                 <Button variant={'outline'} size={'sm'} className='rounded-xl px-8'>Follow</Button>
//                             </div>
//                             <Separator className="mt-4" />
//                         </div>
//                     </div> */}