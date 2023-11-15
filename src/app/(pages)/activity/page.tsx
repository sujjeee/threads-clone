"use client"

import React from 'react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { api } from '@/trpc/react'
import Loading from '@/app/(pages)/loading'
import Username from '@/components/user/user-username'
import { cn, formatTimeAgo, truncateText } from '@/lib/utils'
import UserNotificationAvtar from '@/components/user/user-notification-avatar'
import Error from '@/app/error'
import FollowButton from '@/components/buttons/follow-button'

export default function ActivityPage() {

    const { data, isLoading, isError } = api.notification.getNotification.useQuery()

    if (isLoading) return <Loading />
    if (isError) return <Error />

    const { notifications } = data
    const reversedNotifications = [...notifications].reverse();

    return (
        <>
            {data && data.notifications.length > 0 ? (
                reversedNotifications.map((activity, index) => (
                    <div key={index} className={cn("flex w-full mt-4", { 'mb-[15vh]': index == reversedNotifications.length - 1 })}>
                        <UserNotificationAvtar
                            username={activity.senderUser.username}
                            image={activity.senderUser.image ?? ''}
                            fullname={activity.senderUser.fullname ?? ''}
                            type={activity.type}
                        />
                        <div className='flex flex-col w-full ml-3'>
                            <div className='flex justify-between items-center w-full'>
                                <div className="flex flex-col gap-1 ">
                                    <div className='flex gap-1 items-center'>
                                        <Username author={activity.senderUser} />
                                        <time className='text-muted-foreground ml-3 leading-none text-[15px]'>
                                            {formatTimeAgo(activity.createdAt)}
                                        </time>
                                    </div>
                                    <Link href={`/@${activity.senderUser.username}`}>
                                        {activity.type !== "ADMIN"
                                            ? <div className='text-[15px] text-[#6A6A6A] tracking-wide leading-0 whitespace-pre-line'>
                                                <div dangerouslySetInnerHTML={{
                                                    __html: truncateText(activity.message, 100).slice(1, -1).replace(/\\n/g, '\n')
                                                }} />
                                            </div>
                                            : <span className="text-[15px] text-accent-foreground tracking-wide leading-5">
                                                {activity.message}
                                            </span>
                                        }
                                    </Link>
                                </div>
                                {activity.type === "FOLLOW" && (
                                    <FollowButton
                                        className="text-[14px] px-6"
                                        variant='outline'
                                        author={activity.senderUser} />
                                )}
                            </div>
                            <Separator className="mt-3" />
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