
import { Heart, MessageCircle, MoreHorizontal, Plus, Repeat, Repeat2, Send } from 'lucide-react'
import React from 'react'
import { Separator } from './ui/separator'

export default function Post() {
    const text = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni suscipit tempore cumque. Quos @reprehenderit eaque sint numquam doloribus fugit beatae nam delectus fuga facilis modi excepturi dolore ducimus autem, unde @sequi itaque ullam repellat debitis?"

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

            <div className="flex w-full gap-2 py-4">
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
                        <h1 className='font-semibold text-base '>sujjeee</h1>
                        <div className='flex justify-center items-center gap-3'>
                            <time className="text-muted-foreground tracking-wide">2w</time>
                            <button className="flex">
                                <MoreHorizontal className='h-5 w-5' />
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className='text-[15px] pr-2'>
                            {formattedText}
                        </p>
                        <ul className="relative flex gap-2 overflow-x-auto p-0 thread__carousel mb-1 mt-3 ">
                            {/* <li tabIndex={0}><img src="https://images.pexels.com/photos/4065906/pexels-photo-4065906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" /></li>
                            <li><img src="https://reviewed-com-res.cloudinary.com/image/fetch/s--Vbn2kwJ---/b_white,c_limit,cs_srgb,f_auto,fl_progressive.strip_profile,g_center,q_auto,w_972/https://reviewed-production.s3.amazonaws.com/1630593960000/meatsmoking_hero.jpg" alt="" /></li> */}
                            {/* <li><img src="https://images.pexels.com/photos/3367850/pexels-photo-3367850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" /></li> */}
                        </ul>
                        <div className='mb-3  overflow-hidden rounded-xl w-fit '>
                            <img src="https://images.pexels.com/photos/4048598/pexels-photo-4048598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className='object-contain max-h-[500px] max-w-full border' />
                        </div>
                    </div>

                    <div className='flex flex-col gap-3'>
                        <div className="flex gap-3 text-sm font-bold ">
                            <Heart className='h-5 w-5' />
                            <MessageCircle className='h-5 w-5' />
                            <Repeat className='h-5 w-5' />
                            <Send className='h-5 w-5' />
                        </div>
                        <div className="flex items-start gap-2 text-gray-500 text-xs sm:text-[14px] text-center">
                            <p>12 replies</p>
                            <p>16 likes</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
