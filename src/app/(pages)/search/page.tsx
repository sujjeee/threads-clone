import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User2 } from 'lucide-react'
import React from 'react'

export default function page() {
    return (
        <div className='container max-w-[620px] z-[10] px-6 flex flex-col w-full mt-1 '>
            <div className="relative w-full flex border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground  pl-14 rounded-2xl bg-black/40 h-16 text-[14px]">
                <Icons.search className="h-4 w-4 text-[#4D4D4D] absolute left-6 -translate-y-2/4 top-2/4 " />
                <input
                    className=" mini-scrollbar resize-none bg-transparent w-full placeholder:text-[#777777] outline-none placeholder:text-[15px]"
                    placeholder="Search"
                />
            </div>
            <div className='flex w-full mt-7'>
                <Avatar className="h-10 w-10 relative overflow-visible">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className='flex flex-col w-full  ml-3'>
                    <div className='flex justify-between  w-full'>
                        <div className="flex flex-col gap-0.5 mt-1.5">
                            <div className='flex gap-1 justify-center items-center'>
                                <p className="text-[15px] font-semibold leading-none hover:underline">
                                    _trading.motivation_</p>
                            </div>
                            <p className="text-sm  text-[#6A6A6A] tracking-wide">
                                Trading Motivation
                            </p>
                            <span className='mt-2'>18.8K followers</span>
                        </div>
                        <Button variant={'outline'} size={'sm'} className='rounded-xl px-8'>Follow</Button>
                    </div>
                    <Separator className="mt-4" />
                </div>
            </div>
        </div>
    )
}
