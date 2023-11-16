"use client"

import React from 'react'
import { useImageStore } from '@/store/image'
import Image from 'next/image'

interface PostImageCardProps {
    image: string | undefined
}

const PostImageCard: React.FC<PostImageCardProps> = ({ image }) => {

    const { setImageUrl } = useImageStore()

    // TODO: need to fix this 
    // const buffer = await fetch(image).then(async (res) => {
    //     return Buffer.from(await res.arrayBuffer())
    // })

    // const { base64 } = await getPlaiceholder(buffer)

    return (
        <div className='relative overflow-hidden rounded-[12px] border border-border w-fit mt-2.5 cursor-pointer'>
            <Image
                loading="lazy"
                src={image ?? ''}
                width={630}
                height={630}
                alt="Will add alt-text soon!"
                onClick={() => {
                    setImageUrl(image)
                }}
                className='object-contain max-h-[520px] w-max  rounded-[12px]' />
        </div>
    )
}

export default PostImageCard

