"use client"

import React from 'react'
import { Separator } from '../ui/separator'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Icons } from '../icons'
import { cn } from '@/lib/utils'

interface ThreadCardProps {

}

const ThreadCard: React.FC<ThreadCardProps> = ({ }) => {
    const [oneThread, setOneThread] = React.useState(true)
    return (
        <>
            <Separator />
            <div className={cn('flex w-full gap-2 pt-4 max-w-[620px]', {
                'py-4 pb-2': oneThread
            })}>
                <div className="flex flex-col items-center gap-1.5">
                    <button className='relative '>
                        <div className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full'>
                            <img
                                src='https://avatar.vercel.sh/1'
                                alt="Account Avatar"
                                className="rounded-full w-full h-full "
                            />
                        </div>
                        <div className='bg-foreground absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-background'>
                            <Plus className='h-4 w-4 p-0.5' />
                        </div>
                    </button>
                    {!oneThread && <div className="h-full w-0.5 bg-muted rounded-full" />}

                </div>
                <div className="flex flex-col w-full">
                    <div className="justify-center items-start self-stretch flex flex-col max-md:max-w-full px-2 ">
                        <div className="justify-center items-start flex w-full flex-col  pt-0 self-start">
                            <div className="items-start flex w-full justify-between gap-5 py-px self-start max-md:max-w-full max-md:flex-wrap">
                                <div className="flex items-center justify-center gap-1.5">
                                    <h1 className="text-white text-[15px] font-semibold leading-[0px] "> threads </h1>
                                    <Icons.verified className='w-3 h-3' />
                                </div>
                                <div className="justify-between items-center self-stretch flex gap-2.5">
                                    <div className="text-right text-[15px] leading-none self-stretch  text-[#777777]"> 45m</div>
                                    <MoreHorizontal className='aspect-square object-cover object-center h-4 w-4 overflow-hidden flex-1' />
                                </div>
                            </div>
                            <div className="text-white text-base leading-5 mt-1 max-md:max-w-full"> This episode had me on the edge of my seat the entire time. </div>
                            <div className="flex  font-bold -ml-2 mt-2 w-full">
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit'>
                                    <Icons.heart className='w-5 h-5 ' />
                                </div>
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit'>
                                    <Icons.reply className='w-5 h-5 ' />
                                </div>
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit'>
                                    <Icons.repost className='w-5 h-5 ' />
                                </div>
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 '>
                                    <Icons.share className='w-5 h-5 ' />
                                </div>
                            </div>
                        </div>
                        {/* <div className="flex items-start gap-2 text-[#777777] text-[15px] text-center mt-0.5 pb-4">
                            <p>12 replies</p>
                            <p>16 likes</p>
                        </div> */}
                    </div>
                </div>
            </div >
            {/* use this in home page */}
            {/* <div className='flex items-center gap-2 mt-0.5 pb-4'>
                <div className="flex justify-center items-center w-[36px] ">
                    <img
                        src='https://avatar.vercel.sh/1'
                        alt="Account Avatar"
                        className="rounded-full  h-4 w-4"
                    />
                </div>
                <div className="flex items-start gap-2 text-[#777777] text-[15px] text-center px-2 ">
                    <p>12 replies</p>
                    <p>16 likes</p>
                </div>
            </div> */}
        </>
    )
}

export default ThreadCard