"use client"

import React from 'react'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ResizeTextarea } from '@/components/ui/resize-textarea'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface CreateThreadProps {
    showIcon: boolean
}

const CreateThread: React.FC<CreateThreadProps> = ({ showIcon }) => {

    const path = usePathname()

    const [threadData, setThreadData] = React.useState({
        privacy: "Anyone can reply",
        text: "",
        images: []
    })

    const handleFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setThreadData({
            ...threadData,
            [name]: value,
        });
    };

    console.log("threadData", threadData)
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
            <DialogContent className='border-none bg-transparent sm:max-w-[680px] max-w-lg w-full shadow-none'>
                <h1 className='w-full text-center font-bold mb-2'>New thread</h1>
                <Card className="ring-offset-0 border-none ring-1 ring-[#393939] bg-[#181818] rounded-2xl">
                    <div className='overflow-y-auto no-scrollbar p-6 max-h-[70vh] '>
                        <div className="flex space-x-3">
                            <Avatar className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full'>
                                <AvatarImage src="https://avatar.vercel.sh/5" />
                                <AvatarFallback>JL</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col gap-1.5 w-full'>
                                <p className="text-[15px] font-medium leading-none tracking-normal">sujjeee</p>
                                <ResizeTextarea
                                    name='text'
                                    value={threadData.text}
                                    onChange={handleFieldChange}
                                    placeholder="Start a thread..."
                                />
                                <div className='space-y-2 mt-1'>

                                    <div className='text-[#777777] flex gap-1  items-center text-[15px]'>
                                        <Icons.image className='h-5 w-5   transform active:scale-75 transition-transform cursor-pointer' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between items-center w-full p-6'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className='select-none'>
                                <button className='text-[15px] text-[#777777] tracking-normal z-50 px-2 cursor-pointer'>{threadData.privacy}</button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className='bg-[#181818] rounded-2xl w-[190px] mt-1'>
                                <DropdownMenuItem
                                    className='focus:bg-transparent px-4 tracking-normal font-semibold py-2 cursor-pointer text-[15px]'
                                    onClick={() => {
                                        setThreadData({
                                            ...threadData,
                                            privacy: "Anyone can reply",
                                        });
                                    }}
                                >
                                    Anyone
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className='bg-[#393939] h-[1.2px] ' />
                                <DropdownMenuItem
                                    className='focus:bg-transparent px-4 tracking-normal font-semibold py-2 cursor-pointer text-[15px]'
                                    onClick={() => {
                                        setThreadData({
                                            ...threadData,
                                            privacy: "Profiles you follow can reply",
                                        });
                                    }}
                                >
                                    Profiles you follow
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className='bg-[#393939] h-[1.2px]' />
                                <DropdownMenuItem
                                    className='focus:bg-transparent px-4 tracking-normal font-semibold py-2 cursor-pointer text-[15px]'
                                    onClick={() => {
                                        setThreadData({
                                            ...threadData,
                                            privacy: "Profiles you mention can reply",
                                        });
                                    }}>
                                    Mentioned only
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            size={'sm'}
                            disabled={threadData.text === ''}
                            className='rounded-full px-4 font-semibold'>
                            Post
                        </Button>
                    </div>
                </Card>
            </DialogContent>
        </Dialog>
    )
}

export default CreateThread