"use client"

import { useImageStore } from '@/store/image'
import { X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const FullscreenImageView: React.FC = ({ }) => {

    const { imageUrl, setImageUrl } = useImageStore()

    return (
        imageUrl &&
        <div className="fixed inset-0 z-[150] bg-black  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <span
                onClick={() => setImageUrl('')}
                className="top-5 left-5 text-[#525151] text-[1.2rem] md:text-[1.5rem] absolute p-1 md:p-2 font-thin rounded-full bg-[#181818]  cursor-pointer" >
                <X className='w-8 h-8' />
            </span>
            <div className="fixed left-[50%] top-[50%] z-[999] grid w-full translate-x-[-50%] translate-y-[-50%] max-w-[90vw]  max-h-[100vh] ">
                <Image
                    width={630}
                    height={630}
                    src={imageUrl}
                    alt="Image with full screen view"
                    className='w-max h-full mx-auto object-cover' />
            </div>
        </div>
    )
}

export default FullscreenImageView