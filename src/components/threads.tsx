"use client"

import React from 'react'
import { Icons } from './icons'
import Link from 'next/link'
import { Separator } from './ui/separator'


export default function Threads() {
    return (
        <>
            <Separator />
            <div className="px-4 my-4 w-full font-sans">
                <div className="flex justify-start gap-8">
                    <div
                        className='relative border-l-2 border-[#333] border-opacity-70 ml-2'
                    >
                        <div className="flex -ml-7 flex-col w-14 h-full justify-between items-center shrink-0 absolute">
                            <div>
                                <img
                                    src='https://avatar.vercel.sh/1'
                                    width={35}
                                    height={35}
                                    alt="Account Avatar"
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 w-full">
                                <p className="text-md sm:text-lg font-medium">
                                    username
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs sm:text-sm text-gray-500">
                                    13
                                </span>
                            </div>
                        </div>

                        <div className="">
                            <div className="mt-1">
                                <p className="text-xs sm:text-sm text-gray-200">
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro, ipsam aliquid nulla similique dolores hic!
                                </p>
                                <Link href="/" className="text-blue-400">
                                    @hello
                                </Link>
                                {/* <div className="mt-2">{carousel}</div> */}
                            </div>

                            <div className="flex gap-4 mt-3 sm:mt-4">
                                <button type="button">
                                    <Icons.home
                                        className=
                                        'fill-none text-gray-100 sm:text-xl'

                                    />
                                </button>
                                <button type="button">
                                    <Icons.home
                                        className=
                                        'fill-none text-gray-100 sm:text-xl'

                                    />
                                </button>
                                <button type="button">
                                    <Icons.home
                                        className=
                                        'fill-none text-gray-100 sm:text-xl'

                                    />
                                </button>
                                <button type="button">
                                    <Icons.home
                                        className=
                                        'fill-none text-gray-100 sm:text-xl'

                                    />
                                </button>
                            </div>
                            <div className="flex items-start gap-2 text-gray-500 mt-4 text-xs sm:text-[14px] text-center ">
                                <p>12 replies</p>

                                <p>16 likes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
