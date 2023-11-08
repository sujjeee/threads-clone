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
                        className=" mini-scrollbar resize-none bg-transparent w-full placeholder:text-[#777777] outline-none placeholder:text-[15px]"
                        placeholder="Start a thread..."
                    />
                </div>
                <Button
                    disabled={true}
                    size={'sm'}
                    className='rounded-full px-4 font-semibold text-[15px]'>
                    Post
                </Button>
            </div>
            <Separator className='bg-[#333333]' />
        </div>
    )
}

export default HomeCreate