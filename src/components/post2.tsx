
import { Heart, MessageCircle, MoreHorizontal, Plus, Repeat, Repeat2, Send } from 'lucide-react'
import React from 'react'
import { Separator } from './ui/separator'

export default function Post2() {
    const text = "Saying “Nut in Me” Knowing You Already Have 4 Baby Daddies And No Job is Crazy"

    const formattedText = text.split(/(@\w+|@\w+)/).map((part, index) => {
        if (part.startsWith('@')) {
            return <span key={index} className="font-semibold text-blue-500">{part}</span>;
        } else {
            return <span key={index}>{part}</span>;
        }
    });

    return (
        <>
            <Separator />

            <div className="flex w-full gap-2 py-4 max-w-[620px]">
                <div className="flex flex-col items-center gap-1.5">
                    <button className='relative '>
                        <div className='h-9 w-9'>

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
                    <div className="h-full w-0.5 bg-muted rounded-full"></div>
                    <div className="h-4 w-4 ">

                        <img
                            src='https://avatar.vercel.sh/1'
                            alt="Account Avatar"
                            className="rounded-full "
                        />
                    </div>
                </div>

                <div className="flex flex-col w-full px-2 gap-1.5">

                    <div className="flex w-full justify-between ">
                        <h1 className='font-semibold text-base hover:underline'>sujjeee</h1>
                        <div className='flex justify-center items-center gap-3'>
                            <time className="text-muted-foreground tracking-wide">2w</time>
                            <button className="flex">
                                <MoreHorizontal className='h-5 w-5' />
                            </button>
                        </div>

                    </div>
                    <div>
                        <p className='text-[15px]'>
                            {formattedText}
                        </p>
                    </div>

                    <div className='flex flex-col '>
                        <div className="flex text-sm font-bold -ml-2 ">
                            <div className='hover:bg-[#1E1E1E] rounded-full p-2 '>
                                <Heart className='h-5 w-5 ' />
                            </div>
                            <div className='hover:bg-[#1E1E1E] rounded-full p-2 '>
                                <MessageCircle className='h-5 w-5' />
                            </div>
                            <div className='hover:bg-[#1E1E1E] rounded-full p-2 '>
                                <Repeat className='h-5 w-5' />
                            </div>
                            <div className='hover:bg-[#1E1E1E] rounded-full p-2 '>
                                <Send className='h-5 w-5' />
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-gray-500 text-[15px] text-center mt-0.5">
                            <p>12 replies</p>
                            <p>16 likes</p>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}
