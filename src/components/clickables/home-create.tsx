import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface HomeCreateProps { }

const HomeCreate: React.FC<HomeCreateProps> = ({ }) => {
    const { user } = useUser()

    return (
        <div className='flex flex-col w-full'>
            <div className='flex w-full my-4'>
                <div className='w-full flex'>
                    <div>
                        <img
                            src={user?.imageUrl}
                            width={36}
                            height={36}
                            alt="Account Avatar"
                            className="rounded-full mr-4"
                        />
                    </div>
                    <input
                        className=" resize-none bg-transparent w-full placeholder:text-[#777777] outline-none placeholder:text-[15px]"
                        placeholder="Start a thread..."
                    />
                </div>
                <span
                    className='rounded-full font-semibold text-[15px] inline-flex items-center justify-center text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 text-primary-foreground cursor-not-allowed opacity-30  bg-foreground hover:bg-foreground select-none text-white dark:text-black '>
                    Post
                </span>
            </div>
            <Separator />
        </div>
    )
}

export default HomeCreate