"use client"

import React from 'react'
import { Icons } from '@/components/icons'
import { ChevronRight } from 'lucide-react'
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SearchContainer() {
    const [searchValue, setSearchValue] = React.useState('')
    return (
        <div className={cn('absolute rounded-2xl overflow-hidden border border-[#333333] bg-black max-w-xl w-full mb-3 transition-transform duration-300 z-50',
            {
                'scale-105': searchValue !== '',
                'scale-100': searchValue === '',
            }
        )}>
            <div className='relative w-full flex  px-3 py-2  ring-offset-background placeholder:text-muted-foreground pl-14 h-[60px]' >
                <Icons.search className="h-4 w-4 text-[#4D4D4D] absolute left-6 -translate-y-2/4 top-2/4 " />
                <input
                    value={searchValue}
                    className=" mini-scrollbar resize-none text-base bg-transparent w-full placeholder:text-[#777777] outline-none placeholder:text-[15px]"
                    placeholder="Search"
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            {searchValue !== ''
                && <div className=' flex-1 h-full border-t border-[#333333]'>
                    <div className='flex items-center w-full '>
                        <div className='mx-[30px]'>
                            <Icons.search className='h-4 w-4  text-[#4D4D4D]' />
                        </div>
                        <div className='flex justify-between items-center w-full py-5 mr-6'>
                            <span className='text-base font-semibold tracking-normal '>
                                Search for "skahsjt"</span>
                            <ChevronRight className='h-5 w-5  ' />
                        </div>
                    </div>
                    <div className='flex items-center w-full '>
                        <button className='relative mx-5'>
                            <div className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full'>
                                <Avatar className="rounded-full w-full h-full">
                                    <AvatarImage src='' alt='' />
                                    <AvatarFallback>OG</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className='bg-red-500 absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-background hover:scale-105 active:scale-95'>
                                <Icons.heart className='h-4 w-4 p-[3px] text-white' />
                            </div>
                        </button>
                        <div className='flex justify-between items-center w-full border-t border-[#393939] py-5 mr-6'>
                            <div className='flex flex-col  '>
                                <span className='text-base font-semibold tracking-normal '>
                                    sujjeee
                                </span>
                                <span className=' text-[15px] text-[#777777]'>
                                    Suraj Gupta
                                </span>
                            </div>
                            <Button
                                className='px-6  rounded-xl focus:bg-transparent hover:bg-transparent'
                                variant={'outline'}>
                                Follow
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
