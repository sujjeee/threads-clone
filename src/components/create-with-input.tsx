import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const CreateWithInput: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
    const { user } = useUser()

    return (
        <div className='flex flex-col w-full select-none' {...props}>
            <div className='flex w-full my-4'>
                <div className='w-full flex select-none'>
                    <Avatar className="rounded-full outline outline-1 outline-border h-9 w-9 mr-4">
                        <AvatarImage
                            src={user?.imageUrl}
                            alt={user?.username ?? ''}
                            className='object-cover' />
                        <AvatarFallback>
                            {user?.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
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

export default CreateWithInput