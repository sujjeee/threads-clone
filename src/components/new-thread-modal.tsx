"use client"

import React from 'react'
import { Card } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Image } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from './icons'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function NewThreadModal({ showIcon }: { showIcon: boolean }) {
    const path = usePathname()
    return (
        <Dialog>
            <DialogTrigger asChild>
                {showIcon ?
                    <div className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100'>
                        <Icons.create
                            className={cn(
                                "h-6 w-6",
                                path === '/create'
                                    ? "text-forground"
                                    : "text-[#4D4D4D]",
                            )}
                        />
                    </div>
                    : <div className='flex w-full my-4 '>
                        <div className='w-full flex'>
                            <div>
                                <img
                                    src='https://avatar.vercel.sh/1'
                                    width={36}
                                    height={36}
                                    alt="Account Avatar"
                                    className="rounded-full mr-4"
                                />
                            </div>
                            <input
                                className=" mini-scrollbar resize-none bg-transparent w-full placeholder:text-[#777777] outline-none placeholder:text-[15px]"
                                placeholder="Start a thread..."
                            />
                        </div>
                        <Button size={'sm'} className='rounded-full px-4 font-semibold text-[15px]'> Post</Button>
                    </div>}
            </DialogTrigger>
            <DialogContent className='border-none bg-transparent  sm:max-w-screen-sm max-w-lg w-full shadow-none'>
                <h1 className='w-full text-center font-medium'>New Thread</h1>
                <Card className=" w-full p-0 rounded-2xl border bg-[#181818] ">
                    <div className='overflow-y-auto no-scrollbar p-6  pb-4 max-h-[70vh] '>
                        <div className="flex space-x-3">
                            <Avatar className='h-8 w-8'>
                                <AvatarImage src="https://avatar.vercel.sh/5" />
                                <AvatarFallback>JL</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col gap-1.5'>
                                <p className="text-sm font-medium leading-none">Jackson Lee</p>

                                <p className="text-sm text-accent-foreground break-words pr-4 ">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio minus, voluptatibus cupiditate magni quo ab consequatur, ex laborum, unde sint saepe quas? Delectus animi tempore aliquid nobis esse. Magni saepe vel impedit quidem, sed iste?
                                </p>
                                <div className='my-3  overflow-hidden rounded-xl w-fit'>
                                    <img src="https://images.pexels.com/photos/4048598/pexels-photo-4048598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className='object-contain max-h-[500px] max-w-full border' />
                                </div>
                                <Image className='h-5 w-5 mt-2 text-muted' />
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between items-center w-full p-5'>
                        <p className='text-sm text-[#777777] tracking-normal z-50 px-2'>Anyone can reply</p>
                        <Button size={'sm'} className='rounded-full px-4 font-semibold'> Post</Button>
                    </div>
                    <DialogFooter>
                    </DialogFooter>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
// 