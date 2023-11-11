"use client"

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { api } from '@/trpc/react'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import Loading from '../loading'
import Username from '@/components/username'
import { formatTimeAgo, truncateText } from '@/lib/utils'
import NotificationUserAvatar from '@/components/notification-user-avatar'
import Link from 'next/link'

export default function ActivityPage() {

    const { user: loggedUser } = useUser()

    if (!loggedUser) return <Loading />

    const { data, isLoading } = api.notification.getNotification.useQuery({ id: loggedUser.id }, {
        enabled: !!loggedUser
    })

    if (isLoading) return <Loading />

    return (
        <>
            {data && data.length > 0 ? (
                data.map((activity, index) => (
                    <div key={index} className='flex w-full mt-4 '>
                        <NotificationUserAvatar
                            username={activity.user.username}
                            image={activity.user.image ?? ''}
                            fullname={activity.user.fullname ?? ''}
                            type={activity.type}
                        />
                        <div className='flex flex-col w-full ml-3'>
                            <div className='flex justify-between items-center w-full'>
                                <div className="flex flex-col gap-1.5 ">
                                    <div className='flex gap-1 items-center'>
                                        <Username author={activity.user} />
                                        <time className='text-muted-foreground ml-3 leading-none text-[15px]'>
                                            {formatTimeAgo(activity.createdAt)}
                                        </time>
                                    </div>
                                    <Link href={`/@${activity.user.username}/post/${activity.threadId}`}>
                                        {activity.type !== "ADMIN"
                                            ? <p className="text-[15px] text-[#6A6A6A] tracking-wide leading-5">
                                                {truncateText(activity.message, 100)}
                                            </p>
                                            : <p className="text-[15px] text-accent-foreground tracking-wide leading-5">
                                                {activity.message}
                                            </p>
                                        }
                                    </Link>
                                </div>
                                {activity.type === "FOLLOW" && (
                                    <Button variant={'outline'} size={'sm'} className='rounded-xl px-8'>
                                        Follow
                                    </Button>
                                )}
                            </div>
                            <Separator className="mt-4" />
                        </div>
                    </div>
                ))
            ) : (
                <div className="h-[50vh] w-full justify-center items-center flex text-[#777777]">
                    <p>No notifications.</p>
                </div>
            )}
        </>

    )
}