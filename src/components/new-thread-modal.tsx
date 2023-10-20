"use client"

import React from 'react'
import { Card } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Image } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from './icons'
import { usePathname } from 'next/navigation'

export default function NewThreadModal() {
    const path = usePathname()
    return (

        <Dialog>
            <DialogTrigger asChild>
                <Icons.create
                    className={`w-6 h-6 ${path === "/search" ? "" : "text-muted-foreground"
                        }`}
                />
            </DialogTrigger>
            <DialogContent className="max-w-lg w-full rounded-xl p-6 border bg-[#181818] overflow-hidden sm:max-w-[425px]">
                <div className='overflow-y-auto max-h-[400px] h-full'>
                    <div className="flex space-x-3">
                        <Avatar className='h-8 w-8'>
                            <AvatarImage src="https://avatar.vercel.sh/5" />
                            <AvatarFallback>JL</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-1.5'>
                            <p className="text-sm font-medium leading-none">Jackson Lee</p>
                            <p className="text-sm text-accent-foreground">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio minus, voluptatibus cupiditate magni quo ab consequatur, ex laborum, unde sint saepe quas? Delectus animi tempore aliquid nobis esse. Magni saepe vel impedit quidem, sed iste?
                            </p>
                            <div className='my-3  overflow-hidden rounded-xl w-fit'>
                                <img src="https://images.pexels.com/photos/4048598/pexels-photo-4048598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className='object-contain max-h-[500px] max-w-full border' />
                            </div>
                            <Image className='h-5 w-5 mt-2 text-muted' />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className='flex justify-between items-center w-full py-6'>
                        <p className='text-sm text-muted font-medium'>Anyone can reply</p>
                        <Button size={'sm'} className='rounded-full px-4 font-semibold'> Post</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
