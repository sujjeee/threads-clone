import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Heart, User, User2 } from 'lucide-react'
import React from 'react'

export default function ActivityPage() {
    return (
        <>
            <div className='container max-w-[620px] z-[10] px-6 flex w-full mt-6 '>
                <Avatar className="h-10 w-10 relative overflow-visible">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                    <div className='bg-[#6E3DEF] absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-white'>
                        <User2 className='h-[18px] w-[18px] p-1' fill={'white'} />
                    </div>
                </Avatar>
                <div className='flex flex-col w-full  ml-3'>
                    <div className='flex justify-between items-center w-full'>
                        <div className="flex flex-col gap-2 mt-1.5">
                            <div className='flex gap-1 justify-center items-center'>
                                <p className="text-sm font-medium leading-none hover:underline">__siddharth.213__</p>
                                <time className='text-muted-foreground ml-3 leading-none'>6d</time>
                            </div>
                            <p className="text-[14px] text-[#6A6A6A] tracking-wide leading-5">
                                Followed you
                            </p>
                        </div>
                        <Button variant={'outline'} size={'sm'} className='rounded-xl px-8'>Follow</Button>
                    </div>
                    <Separator className="mt-4" />
                </div>
            </div>
            <div className='container max-w-[620px] z-[10] px-6 flex w-full mt-6 '>
                <Avatar className="h-10 w-10 relative overflow-visible">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                    <div className='bg-red-700 absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-white'>
                        <Heart className='h-[18px] w-[18px] p-1' fill='white' />
                    </div>
                </Avatar>
                <div className='flex flex-col w-full  ml-3'>
                    <div className='flex justify-between items-center w-full'>
                        <div className="flex flex-col gap-2 mt-1.5">
                            <div className='flex gap-1 items-center'>
                                <p className="text-sm font-medium leading-none hover:underline">__siddharth.213__</p>
                                <time className='text-muted-foreground ml-3 leading-none'>6d</time>
                            </div>
                            <p className="text-[14px] text-[#6A6A6A] tracking-wide leading-5">
                                Facebook is for 90s kids who still think they’re cool. Instagram is for 20s kids who want to show off their filters...
                            </p>
                        </div>

                    </div>
                    <Separator className="mt-4" />
                </div>
            </div>
        </>
    )
}
